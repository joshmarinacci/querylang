import {propAsString} from './db.js'
import {CATEGORIES} from './schema.js'
import {DataList, HBox, Window} from './ui.js'
import React, {useState} from 'react'
import {format, isWithinInterval, setHours, getHours, setMinutes, getMinutes, isAfter,
    subDays, addDays,
    startOfDay, endOfDay,
} from 'date-fns'
import {AND} from './query2.js'

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


export function Calendar({db, app, appService}) {
    let [today, setToday] = useState(()=>Date.now())
    let current_day = {start:startOfDay(today), end:endOfDay(today)}

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

    return <Window width={500} height={530} title={'calendar'} className={'calendar'} app={app} appService={appService}>
        <h1>{format(today,'E MMM d')}</h1>
        <HBox>
            <button onClick={nav_prev_day}>prev day</button>
            <button onClick={nav_next_day}>next day</button>
        </HBox>
        <DataList data={events}
                  stringify={e => format(e.props.start,"hh:mm aa") + ' ' + propAsString(e,'title')}
        />
    </Window>
}