import {propAsString} from './db.js'
import {CATEGORIES} from './schema.js'
import {DataList, Window} from './ui.js'
import React from 'react'
import {formatWithOptions} from 'date-fns/fp'
import {format, getWeek, startOfWeek, endOfWeek, isWithinInterval, isBefore,
    setHours, getHours, setMinutes, getMinutes, isAfter
} from 'date-fns'
import {AND, query2 as QUERY} from './query2.js'

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


export function Calendar({data}) {
    let now = Date.now()

    let events = QUERY(data,AND(isCalendarCategory(),isEvent()))

    let start_week = startOfWeek(now)
    let end_week = endOfWeek(now)
    let current_week = {start:start_week, end: end_week}
    console.log(start_week, end_week, current_week)
    //only show events that are today
    events.forEach(e => {
        console.log(e.props.start)
        // console.log("inside",isWithinInterval(e.props.start,{start:start_week, end: end_week}))
    })


    // only have events that are within the current week
    events = events.filter(e => {
        return isWithinInterval(e.props.start,current_week) || is_event_repeating_daily(e)
    })

    events.sort((a,b) => day_time_comparator(a.props.start,b.props.start))


    return <Window width={500} height={530} x={650} y={350} title={'calendar'} className={'calendar'}>
        <h1>{format(now,'E MMM d')}</h1>
        <DataList data={events}
                  stringify={e => format(e.props.start,"hh:mm aa") + ' ' + propAsString(e,'title')}
        />
    </Window>
}