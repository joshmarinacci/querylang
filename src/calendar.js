import {propAsString} from './db.js'
import {CATEGORIES} from './schema.js'
import {DataList, Window} from './ui.js'
import React from 'react'
import {formatWithOptions} from 'date-fns/fp'
import {AND, query2 as QUERY} from './query2.js'

const isCalendarCategory = () => ({ CATEGORY:CATEGORIES.CALENDAR.ID })
const isEvent = () => ({ TYPE:CATEGORIES.CALENDAR.TYPES.EVENT })

export function Calendar({data}) {
    let events = QUERY(data,AND(isCalendarCategory(),isEvent()))

    const dateToString = formatWithOptions({ }, 'h:m a')

    return <Window width={500} height={530} x={650} y={350} title={'calendar'} className={'calendar'}>
        <h1>October 8th, 2020</h1>
        <h2>Thursday</h2>
        <DataList data={events}
                  stringify={o => {
                      let start = new Date(o.props.start)
                      return dateToString(start) + ' ' + propAsString(o, 'title')
                  }}
        />
    </Window>
}