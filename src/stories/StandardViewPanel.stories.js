import React, {useState} from 'react'

import "../theme.css"
import {StandardViewPanel} from '../ui/StandardViewPanel.js'
import {makeDB, setProp} from '../db.js'
import {CATEGORIES} from '../schema.js'

export default {
    title: 'QueryOS/StandardViewPanel',
    component: StandardViewPanel,
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

function make_contact() {
    let person = db.make(CATEGORIES.CONTACT.ID, CATEGORIES.CONTACT.TYPES.PERSON)
    setProp(person,'first','Josh')
    setProp(person,'last','Marinacci')
    setProp(person, 'favorite',true)
    setProp(person, 'timezone', 'Europe/Berlin')
    setProp(person,'emails',[
        {
            type:CATEGORIES.CONTACT.TYPES.EMAIL,
            props:{
                type:'personal',
                value:"joshua@marinacci.org",
            },
        },
        {
            type:CATEGORIES.CONTACT.TYPES.EMAIL,
            props:{
                type:'work',
                value:"josh@josh.earth",
            },
        }
    ])
    setProp(person,'phones',[
        {
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
    return <StandardViewPanel object={obj}/>
}

export const HideProps = () => {
    let [obj] = useState(() => make_task())
    return <StandardViewPanel object={obj}
                              hide={["project",'deleted']}
    />
}

export const OrderProps = () => {
    let [obj] = useState(() => make_task())
    return <StandardViewPanel object={obj}
                              hide={['project','deleted']}
                              order={['title','notes']}
    />
}

export const CustomizeProps = () => {
    let [obj] = useState(() => make_task())
    return <StandardViewPanel object={obj}
                              hide={["project"]}
                              custom={{
                                  'deleted':'checkmark',
                                  'completed':'checkmark',
                                  'notes':'paragraph'
                              }}
    />
}


export const Contact = () => {
    let [obj] = useState(() => make_contact())
    return <StandardViewPanel object={obj}
                              custom={{
                                  'favorite':'star'
                              }}
    />
}
