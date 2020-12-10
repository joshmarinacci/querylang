import {HBox, VBox} from '../ui/ui.js'
import React, {useContext, useState} from 'react'
import {format, isWithinInterval, setHours, getHours, setMinutes, getMinutes, isAfter,
    subDays, addDays,
    startOfDay, endOfDay,
    startOfWeek, endOfWeek,
    getDay,
} from 'date-fns'

import "./calendar.css"
import {DBContext} from '../db.js'
import Icon from '@material-ui/core/Icon'

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
    let [view, setView] = useState("week")
    let current_day = {start:startOfDay(today), end:endOfDay(today)}
    let current_week = {start:startOfWeek(today), end:endOfWeek(today)}
    let db = useContext(DBContext)

    // let events = db.QUERY(AND(IS_CATEGORY(CATEGORIES.CALENDAR.ID), IS_TYPE(CATEGORIES.CALENDAR.TYPES.EVENT)))



    function nav_prev_day() {
        setToday(subDays(today,1))
    }

    function nav_next_day() {
        setToday(addDays(today,1))
    }


    let events = [
        { title:"9am for an hour", date:new Date(2020,9,1,9,0), duration: { hours: 1}},
        { title:"2:30pm for 15 min", date:new Date(2020,10,1,12+2,30), duration: { minutes: 15}},
        { title:"3:00pm for 45 min", date:new Date(2020,11,1,12+3,0), duration: {minutes: 45}},
    ];

    // only have events that are within the current week
    events = events.filter(e => isWithinInterval(e.date,current_week))// || is_event_repeating_daily(e))
    // events.sort((a,b) => day_time_comparator(a.date,b.date))

    let panel = <div>foo</div>;
    if(view === 'day') panel = <DayView events={events}/>
    if(view === 'week') panel = <WeekView events={events}/>

    return <VBox grow style={{backgroundColor:'var(--std-bg-color)'}}>
        <h1>{format(today,'E MMM d')}</h1>
        <HBox>
            <Icon onClick={nav_prev_day}>arrow_left</Icon>
            <Icon onClick={nav_next_day}>arrow_right</Icon>
            <ExclusiveToggleBar>
                <button className={view==="list"?"selected":""} onClick={()=>setView('list')}>list</button>
                <button className={view==="day"?"selected":""}  onClick={()=>setView('day')}>day</button>
                <button className={view==="week"?"selected":""}  onClick={()=>setView('week')}>week</button>
            </ExclusiveToggleBar>
        </HBox>
        {panel}
    </VBox>
}

function ExclusiveToggleBar({children}) {
    return <div className={'exclusive-toggle-bar'}>{children}</div>
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

const date_to_col = (date) => {
    let d = getDay(date)
    return d
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

function DayView ({events}) {
    events = events.map((e,i) => <EventItem key={'event'+i} event={e}/>)


    let hours_gutter = []
    for(let i=START_HOUR; i<END_HOUR; i++) hours_gutter.push(<HourGutterItem key={"gutter"+i} hour={i}/>)


    return <div className={'day-view'}>
        {hours_gutter}
        {events}
    </div>
}

function WeekView({events}) {

    events = events.map((e,i) => <WeekEventItem key={'event'+i} event={e}/>)
    let hours_gutter = []
    for(let i=START_HOUR; i<END_HOUR; i++) hours_gutter.push(<HourGutterItem key={"gutter"+i} hour={i}/>)

    let days_gutter = []
    let date = Date.now()
    let start = startOfWeek(date)
    for(let i=0; i<7; i++) {
        days_gutter.push(<DayHeader start={start}/>)
        start = addDays(start,1)
    }

    return <div className={'week-view content-panel'}>
        {days_gutter}
        {hours_gutter}
        {events}
    </div>
}

function DayHeader({start}) {
    return <div className={'day-header'}
                style={{
                    gridColumnStart: date_to_col(start)+2,
                    gridColumnEnd: date_to_col(start)+3,
                    gridRowStart: 1,
                }}
    >{format(start,"E d")}</div>
}

const WeekEventItem = ({event}) => {
    console.log("date is",event.date)
    return <div className={'week-event'} style={{
        gridRowStart: time_to_row(event.date)+1,
        gridRowEnd: time_to_row(event.date) + duration_to_span(event.duration)+1,
        gridColumnStart: date_to_col(event.date)+2,
        gridColumnEnd: date_to_col(event.date)+3,
    }}>{event.title} </div>
}
