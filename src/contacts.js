import React, {useState} from 'react'
import {deepClone, project, propAsString, query, setProp, sort} from './db.js'
import {CATEGORIES, makeNewObject, SORTS} from './schema.js'
import {DataList, EnumPropEditor, HBox, Panel, Spacer, TextPropEditor, Toolbar, VBox, Window} from './ui.js'

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


    const addNewContact = () => {
        let person = makeNewObject(CATEGORIES.CONTACT.TYPES.PERSON)
        data.push(person)
        setSelected(person)
        toggleEditing()
    }

    let panel = <Panel grow>nothing selected</Panel>
    if (selected) {
        panel = <Panel grow>
            <p>
            {propAsString(selected, 'first')}
            {propAsString(selected, 'last')}
            </p>
            <img src={selected.props.icon}/>
            <ul className={'display-emails'}>
                {
                    selected.props.emails.map((email,i)=>{
                        return [<i key={'type'+i}>{propAsString(email,'type')}</i>,
                            <b key={'value'+i}>{propAsString(email,'value')}</b>]
                    })
                }
            </ul>
            <ul className={'display-phones'}>
                {
                    selected.props.phones.map((phone,i)=>{
                        return [<i key={'type'+i}>{propAsString(phone,'type')}</i>,
                            <b key={'value'+i}>{propAsString(phone,'value')}</b>]
                    })
                }
            </ul>
        </Panel>
        if (editing) {
            panel = <Panel grow>
                <VBox className={'edit-emails'}>
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

    return <Window x={120} width={500} height={320} title={'contacts'} className={'contacts'}>
        <HBox grow>
            <VBox>
                <Toolbar>
                    <input type={'search'}/>
                    <button onClick={addNewContact}>+</button>
                </Toolbar>
                <DataList data={items} selected={selected} setSelected={setSelected}
                          stringify={o => propAsString(o, 'first') + " " + propAsString(o, 'last')}/>
            </VBox>
            <VBox grow>
                {panel}
                <Toolbar>
                    <Spacer/>
                    <button
                        disabled={!selected}
                        onClick={toggleEditing}>edit
                    </button>
                </Toolbar>
            </VBox>
        </HBox>
    </Window>
}