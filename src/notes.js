import React, {useState} from 'react'
import {propAsString, query} from './db.js'
import {CATEGORIES} from './schema.js'
import {DataList, HBox, Window} from './ui.js'

export function Notes({data}) {
    const [selected, setSelected] = useState(null)

    let notes = query(data, {
        category: CATEGORIES.NOTES.ID,
        type: CATEGORIES.NOTES.TYPES.NOTE
    })
    return <Window width={400} height={300} x={0} y={560}
                   title={"notes"}>
        <HBox>
            <DataList data={notes}
                      selected={selected}
                      setSelected={setSelected}
                      stringify={(o) => propAsString(o, 'title')}
            />
            <p>{propAsString(selected, 'contents')}</p>
        </HBox>
    </Window>
}