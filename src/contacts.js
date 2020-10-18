import React, {useState} from 'react'
import {deepClone, project, propAsString, sort, useDBChanged} from './db.js'
import {CATEGORIES, SORTS} from './schema.js'
import {
    AddButton,
    DataList,
    EnumPropEditor,
    HBox,
    Panel,
    RemoveButton,
    Spacer,
    TextPropEditor,
    Toolbar,
    VBox,
    Window
} from './ui.js'
import {AND, OR, query2 as QUERY} from './query2.js'

const isPerson = () => ({ TYPE:CATEGORIES.CONTACT.TYPES.PERSON })
const isContactCategory = () => ({ CATEGORY:CATEGORIES.CONTACT.ID })
const isPropSubstring = (prop,value) => ({ substring: {prop, value}})


export function ContactViewPanel ({selected, onEdit}) {
    return <Panel grow>
        <Toolbar>
            <button
                disabled={!selected}
                onClick={onEdit}>edit
            </button>
        </Toolbar>
        <p>
            {propAsString(selected, 'first')}
            &nbsp;
            {propAsString(selected, 'last')}
        </p>
        <img src={selected.props.icon}/>
        <ul className={'display-emails'}>
            {
                selected.props.emails.map((email,i)=>{
                    return [<i key={'type'+i}>{propAsString(email,'type')}</i>,
                        <b key={'value'+i}>
                            <a href={`mailto:${propAsString(email,'value')}`}>
                                {propAsString(email,'value')}
                            </a></b>]
                })
            }
        </ul>
        <ul className={'display-phones'}>
            {
                selected.props.phones.map((phone,i)=>{
                    return [<i key={'type'+i}>{propAsString(phone,'type')}</i>,
                        <b key={'value'+i}><a href={`tel:${propAsString}`}>{propAsString(phone,'value')}</a></b>]
                })
            }
        </ul>
        <ul className={'display-addresses'}>
            {
                selected.props.addresses.map((addr,i)=>{
                    let map = propAsString(addr,'street1')
                        +", "+propAsString(addr,'city')
                        +", "+propAsString(addr,'state')
                        +", "+propAsString(addr,'zipcode')
                    map = map.replaceAll(' ','+')
                    return [
                        <i key={'type'+i}>{propAsString(addr,'type')}</i>,
                        <p key={'address'+i}>
                            <a href={`http://maps.apple.com/?address=${map}`}>
                                {propAsString(addr,'street1')}<br/>
                                {propAsString(addr,'city')} &nbsp;
                                {propAsString(addr,'state')}, &nbsp;
                                {propAsString(addr,'zipcode')}
                            </a>
                        </p>,
                    ]
                })
            }
        </ul>
    </Panel>
}

export function ContactEditPanel({db, onDone, selected}) {
    const [buffer, setBuffer] = useState(()=>{
        return deepClone(selected)
    })
    const addEmail = () => {
        buffer.props.emails.push(db.make(CATEGORIES.CONTACT.ID,CATEGORIES.CONTACT.TYPES.EMAIL))
        db.setProp(buffer,'emails',buffer.props.emails)
    }
    const removeEmail = (o) => {
        buffer.props.emails = buffer.props.emails.filter(t => o!==t)
        db.setProp(buffer,'emails',buffer.props.emails)
    }
    const addPhone = () => {
        buffer.props.phones.push(db.make(CATEGORIES.CONTACT.ID,CATEGORIES.CONTACT.TYPES.PHONE))
        db.setProp(buffer,'phones',buffer.props.phones)
    }
    const removePhone = (o) => {
        buffer.props.phones = buffer.props.phones.filter(t => o!==t)
        db.setProp(buffer,'phones',buffer.props.phones)
    }
    const addAddress = () => {
        buffer.props.addresses.push(db.make(CATEGORIES.CONTACT.ID,CATEGORIES.CONTACT.TYPES.MAILING_ADDRESS))
        db.setProp(buffer,'addresses',buffer.props.addresses)
    }
    const removeAddress = (o) => {
        buffer.props.addresses = buffer.props.addresses.filter(t => o!==t)
        db.setProp(buffer,'addresses',buffer.props.addresses)
    }

    const saveEditing = () => {
        Object.keys(selected.props).forEach(k => {
            selected.props[k] = buffer.props[k]
        })
        onDone()
    }

    const cancelEditing = () => onDone()


    return (<Panel grow>
        <Toolbar>
            <button onClick={saveEditing}>save</button>
            <button onClick={cancelEditing}>cancel</button>
        </Toolbar>

        <VBox className={'edit-emails'} scroll>
            <h3>name</h3>
            <TextPropEditor buffer={buffer} prop={'first'} db={db}/>
            <TextPropEditor buffer={buffer} prop={'last'} db={db}/>
            <h3>email</h3>
            {buffer.props.emails.map((o,i) => {
                return <HBox key={'email_'+i}>
                    <RemoveButton onClick={()=>removeEmail(o)}/>
                    <EnumPropEditor buffer={o} prop={'type'} db={db}/>
                    <TextPropEditor buffer={o} prop={'value'} db={db}/>
                </HBox>
            })}
            <AddButton onClick={addEmail}/>

            <h3>phone</h3>
            {buffer.props.phones.map((o,i) => {
                return <HBox key={'phone_'+i}>
                    <RemoveButton onClick={()=>removePhone(o)}/>
                    <EnumPropEditor buffer={o} prop={'type'} db={db}/>
                    <TextPropEditor buffer={o} prop={'value'} db={db}/>
                </HBox>
            })}
            <AddButton onClick={addPhone}/>

            <h3>address</h3>
            {buffer.props.addresses.map((o,i) => {
                return <HBox key={'address_'+i}>
                    <RemoveButton onClick={()=>removeAddress(o)}/>
                    <EnumPropEditor buffer={o} prop={'type'} db={db}/>
                    <VBox>
                        <TextPropEditor buffer={o} prop={'street1'} db={db}/>
                        <TextPropEditor buffer={o} prop={'street2'} db={db}/>
                        <HBox>
                            <TextPropEditor buffer={o} prop={'city'} db={db}/>
                            <TextPropEditor buffer={o} prop={'state'} db={db}/>
                            <TextPropEditor buffer={o} prop={'zipcode'} db={db}/>
                        </HBox>
                    </VBox>
                </HBox>
            })}
            <AddButton onClick={addAddress}/>
        </VBox>

    </Panel>)
}

export function ContactList({db}) {
    useDBChanged(db,CATEGORIES.CONTACT.ID)

    const [selected, setSelected] = useState(null)
    const [editing, setEditing] = useState(false)
    let [searchTerms, setSearchTerms] = useState("")

    // const toggleEditing = () => {
    //     if (!editing && selected) {
    //         setEditing(true)
    //         // setBuffer(deepClone(selected))
    //     }
    // }

    let items = db.QUERY(AND(isContactCategory(),isPerson()))
    items = sort(items, ["first", "last"], SORTS.ASCENDING)
    items = project(items, ["first", "last", "id"])

    if(searchTerms.length >= 2) items = QUERY(items,OR(isPropSubstring('last',searchTerms),isPropSubstring('first',searchTerms)))

    const addNewContact = () => {
        let person = db.make(CATEGORIES.CONTACT.ID, CATEGORIES.CONTACT.TYPES.PERSON)
        db.add(person)
        setSelected(person)
        setEditing(true)
    }

    let panel = <Panel grow>nothing selected</Panel>
    if (selected) {
        panel = <ContactViewPanel selected={selected} onEdit={()=>setEditing(true)}/>
    }
    if(editing) {
        panel = <ContactEditPanel selected={selected} onDone={()=>setEditing(false)} db={db}/>
    }

    return <Window x={120} width={500} height={320} title={'contacts'} className={'contacts'}>
        <HBox grow>
            <VBox>
                <Toolbar>
                    <input type={'search'} value={searchTerms} onChange={e => setSearchTerms(e.target.value)}/>
                    <AddButton onClick={addNewContact}/>
                </Toolbar>
                <DataList data={items} selected={selected} setSelected={setSelected}
                          stringify={o => propAsString(o, 'first') + " " + propAsString(o, 'last')}/>
            </VBox>
            <VBox grow>
                {panel}
                <Toolbar>
                    <Spacer/>
                </Toolbar>
            </VBox>
        </HBox>
    </Window>
}