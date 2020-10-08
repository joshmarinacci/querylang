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
    return <Window width={620} height={300} x={0} y={580} title={"notes"} className={'notes'}>
        <HBox>
            <DataList data={notes}
                      selected={selected}
                      setSelected={setSelected}
                      stringify={(o) => propAsString(o, 'title')}
            />
            <p style={{
                flex:1.0,
                border:'1px solid black',
                padding:'1.0em',
                margin:0,
            }}>{propAsString(selected, 'contents')}</p>
        </HBox>
    </Window>
}