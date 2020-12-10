import {DBContext, makeDB, setProp, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import React, {useState} from 'react'
import {StandardEditPanel} from '../ui/StandardEditPanel.js'

export default {
    title: 'QueryOS/SchemaPanels',
    component: StandardEditPanel,
    argTypes: {
    },
};
let db = makeDB()

const make_task =() => {
    let task = db.make(CATEGORIES.TASKS.ID, CATEGORIES.TASKS.TYPES.TASK)
    setProp(task,'title',"a cool task")
    setProp(task,'completed',true)
    setProp(task,'notes',"this is some very long notes to read. Like super duper long. So you're goint o have to spend some time reading this.")
    return task
}
const make_note = () => {
    let note = db.make(CATEGORIES.NOTES.ID, CATEGORIES.NOTES.TYPES.NOTE)
    setProp(note,'title','rad note')
    return note
}

function make_contact() {
    let person = db.make(CATEGORIES.CONTACT.ID, CATEGORIES.CONTACT.TYPES.PERSON)
    setProp(person,'first','Josh')
    setProp(person,'last','Marinacci')
    setProp(person, 'favorite',true)
    setProp(person, 'timezone', 'Europe/Berlin')
    setProp(person,'emails',[
        {
            category:CATEGORIES.CONTACT.ID,
            type:CATEGORIES.CONTACT.TYPES.EMAIL,
            props:{
                type:'personal',
                value:"joshua@marinacci.org",
            },
        },
        {
            category:CATEGORIES.CONTACT.ID,
            type:CATEGORIES.CONTACT.TYPES.EMAIL,
            props:{
                type:'work',
                value:"josh@josh.earth",
            },
        }
    ])
    setProp(person,'phones',[
        {
            category:CATEGORIES.CONTACT.ID,
            type:CATEGORIES.CONTACT.TYPES.PHONE,
            props: {
                type: 'personal',
                value: '707-509-9627'
            }
        }
    ])
    setProp(person,'icon','http://placekeanu.com/64/64/d')
    setProp(person,'addresses',[
        {
            category:CATEGORIES.CONTACT.ID,
            type:CATEGORIES.CONTACT.TYPES.MAILING_ADDRESS,
            props: {
                type: 'home',
                street1: '4055 Eddystone Place',
                city: 'Eugene',
                state: 'OR',
                zipcode: '97404',
                country: 'USA'
            }
        }
    ])

    // setProp(task,'title',"a cool task")
    // setProp(task,'completed',true)
    // setProp(task,'notes',"this is some very long notes to read. Like super duper long. So you're goint o have to spend some time reading this.")
    return person
}

export const Default = () => {
    let [obj] = useState(() => make_task())
    useDBChanged(db,obj.category)
    return <DBContext.Provider value={db}>
        <StandardEditPanel object={obj} hide={['project']}/>
    </DBContext.Provider>
}

export const Contact = () => {
    let [obj] = useState(() => make_contact())
    useDBChanged(db,obj.category)
    return <DBContext.Provider value={db}>
        <StandardEditPanel object={obj}/>
    </DBContext.Provider>
}

export const NoteWithTags = () => {
    let [obj] = useState(() => make_note())
    useDBChanged(db,obj.category)
    return <DBContext.Provider value={db}>
        <StandardEditPanel object={obj} hide={['project']}/>
    </DBContext.Provider>
}
