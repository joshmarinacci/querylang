import {propAsString, query} from './db.js'
import {CATEGORIES} from './schema.js'
import {DataList, Window} from './ui.js'
import React from 'react'

export function Calendar({data}) {
    let events = query(data, {category: CATEGORIES.CALENDAR.ID, type: CATEGORIES.CALENDAR.TYPES.EVENT})

    return <Window width={500} height={530} x={650} y={350} title={'calendar'}
    >
        <h1>October 8th, 2020</h1>
        <h2>Thursday</h2>
        <DataList data={events}
                  stringify={o => {
                      let start = new Date(o.props.start)
                      return start.toTimeString()
                          + propAsString(o, 'title')
                  }}
        />
    </Window>
}