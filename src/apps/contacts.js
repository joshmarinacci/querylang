import React, {useContext, useState} from 'react'
import {DBContext, deepClone, propAsBoolean, propAsString, setProp, sort, useDBChanged} from '../db.js'
import {CATEGORIES, SORTS} from '../schema.js'
import {
    AddButton,
    DataList,
    EnumPropEditor,
    HBox,
    Panel,
    RemoveButton,
    StandardListItem,
    TextPropEditor,
    Toolbar,
    VBox
} from '../ui/ui.js'
import "./contacts.css"
import {AND, IS_CATEGORY, IS_PROP_SUBSTRING, IS_TYPE, OR, query2 as QUERY} from '../query2.js'
import Icon from '@material-ui/core/Icon'
import {StandardViewPanel} from '../ui/StandardViewPanel.js'
import {Grid2Layout} from '../ui/grid3layout.js'

let CONTACTS_VIEW_CUSTOMIZATIONS = {
    'favorite':'star',
    'addresses':{
        divider:true,
        expand:true,
        hide_empty: true,
        order:[
            {
                name:'type',
                value_label:true,
            },
            {
                name:'street1',
            },
            {
                name:'street2',
            },
            {
                group:true,
                names:['city','state','zipcode','country']
            }
        ],
    },
    'emails': {
        expand:true,
        hide_empty: true,
        divider:true,
        order:[
            { name:'type', value_label:true},
            { name:'value'}
        ],
    },
    'phones':{
        divider:true,
        expand:true,
        hide_empty: true,
        order:[
            { name:'type', value_label:true},
            { name:'value'}
        ],
    },
    'timezone':{
        hide_empty:true,
    }
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
            setProp(selected,k,buffer.props[k])
        })
        onDone()
    }

    const cancelEditing = () => onDone()


    return (<VBox>
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

    </VBox>)
}

export function ContactList({app}) {
    const db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.CONTACT.ID)

    const [selected, setSelected] = useState(null)
    const [editing, setEditing] = useState(false)
    let [searchTerms, setSearchTerms] = useState("")

    let items = db.QUERY(AND(
        IS_CATEGORY(CATEGORIES.CONTACT.ID),
        IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON)))
    items = sort(items, ["first", "last"], SORTS.ASCENDING)

    if(searchTerms.length >= 2) items = QUERY(items,
        OR(IS_PROP_SUBSTRING('last',searchTerms),
            IS_PROP_SUBSTRING('first',searchTerms)
        ))

    const addNewContact = () => {
        let person = db.make(CATEGORIES.CONTACT.ID, CATEGORIES.CONTACT.TYPES.PERSON)
        db.add(person)
        setSelected(person)
        setEditing(true)
    }

    let panel = <Panel grow>nothing selected</Panel>
    if (selected) {
        panel = <StandardViewPanel object={selected} custom={CONTACTS_VIEW_CUSTOMIZATIONS}
                                   order={[
                                       {group:true, names:['first','last']}
                                   ]}
        />
    }
    if(editing) {
        panel = <ContactEditPanel selected={selected} onDone={()=>setEditing(false)} db={db}/>
    }


    return <Grid2Layout statusbar={false}>
            <Toolbar className={'col1 span3'}>
                <input type={'search'} value={searchTerms} onChange={e => setSearchTerms(e.target.value)}/>
                <Icon onClick={addNewContact}>add_circle</Icon>
            </Toolbar>
            <DataList data={items} selected={selected} setSelected={setSelected}
                      className={'col1 row2'}
                      stringify={(o,i) => <StandardListItem icon={'person'} title={`${propAsString(o,'first')} ${propAsString(o,'last')}`}/>}/>
              <Panel className={'col2 row2'}>
                  {panel}
              </Panel>
        </Grid2Layout>

}