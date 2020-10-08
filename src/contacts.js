import React, {useState} from 'react'
import {deepClone, project, propAsString, query, sort} from './db.js'
import {CATEGORIES, SORTS} from './schema.js'
import {DataList, HBox, Panel, TextPropEditor, VBox, Window} from './ui.js'

export function ContactList({data}) {
    const [selected, setSelected] = useState(null)
    const [editing, setEditing] = useState(false)
    const [buffer, setBuffer] = useState({})

    const toggleEditing = () => {
        if (!editing && selected) {
            setBuffer(deepClone(selected))
            setEditing(true)
        }
    }

    const saveEditing = () => {
        Object.keys(selected.props).forEach(k => {
            selected.props[k] = buffer.props[k]
        })
        setEditing(false)
    }
    const cancelEditing = () => {
        setEditing(false)
    }

    const updateBuffer = (buffer, key, ev) => {
        setBuffer(deepClone(buffer))
    }

    // DATA where type === PERSON, sort ascending by [first, last], project(first,last,id)
    let items = query(data, {category: CATEGORIES.CONTACT, type: CATEGORIES.CONTACT.TYPES.PERSON})
    items = sort(items, ["first", "last"], SORTS.ASCENDING)
    items = project(items, ["first", "last", "id"])

    let panel = <Panel grow>nothing selected</Panel>
    if (selected) {
        panel = <Panel grow>
            {propAsString(selected, 'first')}
            {propAsString(selected, 'last')}
            <img src={selected.props.icon}/>
        </Panel>
        if (editing) {
            panel = <Panel grow>
                <TextPropEditor buffer={buffer} prop={'first'} onChange={updateBuffer}/>
                <TextPropEditor buffer={buffer} prop={'last'} onChange={updateBuffer}/>
                <button onClick={saveEditing}>save</button>
                <button onClick={cancelEditing}>cancel</button>
            </Panel>
        }
    }

    return <Window x={120} width={400} height={250} title={'contacts'}>
        <HBox grow>
            <DataList data={items} selected={selected} setSelected={setSelected}
                      stringify={o => propAsString(o, 'first') + " " + propAsString(o, 'last')}/>
            <VBox grow>
                {panel}
                <button
                    disabled={!selected}
                    onClick={toggleEditing}>edit
                </button>
            </VBox>
        </HBox>
    </Window>
}