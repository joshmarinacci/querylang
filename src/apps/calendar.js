import {CATEGORIES} from '../schema.js'
import {HBox, Window} from '../ui.js'
import React, {useContext, useState} from 'react'
import {format, isWithinInterval, setHours, getHours, setMinutes, getMinutes, isAfter,
    subDays, addDays,
    startOfDay, endOfDay,
} from 'date-fns'
import {AND} from '../query2.js'

import "./calendar.css"
import {DBContext} from '../db.js'

const isCalendarCategory = () => ({ CATEGORY:CATEGORIES.CALENDAR.ID })
const isEvent = () => ({ TYPE:CATEGORIES.CALENDAR.TYPES.EVENT })

function toTodayTime (d) {
    let A = Date.now()
    A = setHours(A, getHours(d))
    A = setMinutes(A, getMinutes(d))
    return A
}
function day_time_comparator(a,b) {
    let A = toTodayTime(a)
    let B = toTodayTime(b)
    if(isAfter(A,B)) {
        return 1
    } else {
        return -1
    }
}

function is_event_repeating_daily(e) {
    if(e.props.repeats === 'daily') {
        return true
    }
    return false
}

let START_HOUR = 6
let END_HOUR = 12+10

export function Calendar({app}) {
    let [today, setToday] = useState(()=>Date.now())
    let current_day = {start:startOfDay(today), end:endOfDay(today)}
    let db = useContext(DBContext)

    let events = db.QUERY(AND(isCalendarCategory(),isEvent()))

    // only have events that are within the current week
    events = events.filter(e => isWithinInterval(e.props.start,current_day) || is_event_repeating_daily(e))
    events.sort((a,b) => day_time_comparator(a.props.start,b.props.start))


    function nav_prev_day() {
        setToday(subDays(today,1))
    }

    function nav_next_day() {
        setToday(addDays(today,1))
    }

    return <Window app={app}>
        <h1>{format(today,'E MMM d')}</h1>
        <HBox>
            <button onClick={nav_prev_day}>prev day</button>
            <button onClick={nav_next_day}>next day</button>
        </HBox>
        <DayView/>
    </Window>
}

const time_to_row = (date) => {
    let h = getHours(date)
    let m = getMinutes(date)
    return (h-START_HOUR)*4 + 1 + Math.floor(m/15)*1
}

const duration_to_span = (duration) => {
    let hours = duration.hours || 0
    let minutes = duration.minutes || 0
    return hours*4 + Math.floor(minutes/15)*1
}

const HourGutterItem = ({hour}) => {
    let date = Date.now()
    date = setHours(date,hour)
    date = setMinutes(date,0)
    let str = format(date,"p")
    return <div className={'hour'} style={{
        gridRowStart: time_to_row(new Date(0,0,0,hour)),
    }}>{str}</div>
}

const EventItem = ({event}) => {
    return <div className={'event'} style={{
        gridRowStart: time_to_row(event.date),
        gridRowEnd: time_to_row(event.date) + duration_to_span(event.duration)
    }}>{event.title} </div>
}

function DayView () {

    let events = [
        { title:"9am for an hour", date:new Date(0,0,0,9,0), duration: { hours: 1}},
        { title:"2:30pm for 15 min", date:new Date(0,0,0,12+2,30), duration: { minutes: 15}},
        { title:"3:00pm for 45 min", date:new Date(0,0,0,12+3,0), duration: {minutes: 45}},
    ]
    events = events.map((e,i) => <EventItem key={'event'+i} event={e}/>)


    let hours_gutter = []
    for(let i=START_HOUR; i<END_HOUR; i++) hours_gutter.push(<HourGutterItem key={"gutter"+i} hour={i}/>)


    return <div className={'day-view'}>
        {hours_gutter}
        {events}
    </div>
}