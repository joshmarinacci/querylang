import React, {useState} from 'react'
import {deepClone, project, propAsString, query, sort} from './db.js'
import {CATEGORIES, makeNewObject, SORTS} from './schema.js'
import {DataList, EnumPropEditor, HBox, Panel, TextPropEditor, VBox, Window} from './ui.js'

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
    const cancelEditing = () => setEditing(false)

    const update = () => setBuffer(deepClone(buffer))

    const addEmail = () => {
        buffer.props.emails.push(makeNewObject(CATEGORIES.CONTACT.TYPES.EMAIL))
        update()
    }
    const removeEmail = (o) => {
        buffer.props.emails = buffer.props.emails.filter(t => o!==t)
        update()
    }

    // DATA where type === PERSON, sort ascending by [first, last], project(first,last,id)
    let items = query(data, {category: CATEGORIES.CONTACT, type: CATEGORIES.CONTACT.TYPES.PERSON})
    items = sort(items, ["first", "last"], SORTS.ASCENDING)
    items = project(items, ["first", "last", "id"])

    let panel = <Panel grow>nothing selected</Panel>
    if (selected) {
        panel = <Panel grow>
            <p>
            {propAsString(selected, 'first')}
            {propAsString(selected, 'last')}
            </p>
            <img src={selected.props.icon}/>
            <ul>
            {
                selected.props.emails.map((e,i)=>{
                    return <li key={i}>{propAsString(e,'type')} :
                        {propAsString(e,'value')}</li>
                })
            }
            </ul>
        </Panel>
        if (editing) {
            panel = <Panel grow>
                <VBox>
                    <h3>name</h3>
                    <TextPropEditor buffer={buffer} prop={'first'} onChange={update}/>
                    <TextPropEditor buffer={buffer} prop={'last'} onChange={update}/>
                    <h3>emails</h3>
                    {buffer.props.emails.map((o,i) => {
                        return <HBox key={i}>
                            <button onClick={()=>removeEmail(o)}>-</button>
                            <EnumPropEditor buffer={o} prop={'type'} onChange={update}/>
                            <TextPropEditor buffer={o} prop={'value'} onChange={update}/>
                        </HBox>
                    })}
                    <button onClick={addEmail}>+</button>
                </VBox>

                <button onClick={saveEditing}>save</button>
                <button onClick={cancelEditing}>cancel</button>
            </Panel>
        }
    }

    return <Window x={120} width={400} height={300} title={'contacts'}>
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