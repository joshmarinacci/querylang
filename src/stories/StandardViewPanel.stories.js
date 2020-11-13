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

const gen_data =() => {
    let task = db.make(CATEGORIES.TASKS.ID, CATEGORIES.TASKS.TYPES.TASK)
    setProp(task,'title',"a cool task")
    setProp(task,'completed',true)
    setProp(task,'notes',"this is some very long notes to read. Like super duper long. So you're goint o have to spend some time reading this.")
    return task
}

export const Default = () => {
    let [obj] = useState(() => gen_data())
    return <StandardViewPanel object={obj}/>
}

export const HideProps = () => {
    let [obj] = useState(() => gen_data())
    return <StandardViewPanel object={obj}
                              hide={["project",'deleted']}
    />
}

export const OrderProps = () => {
    let [obj] = useState(() => gen_data())
    return <StandardViewPanel object={obj}
                              hide={['project','deleted']}
                              order={['title','notes']}
    />
}

export const CustomizeProps = () => {
    let [obj] = useState(() => gen_data())
    return <StandardViewPanel object={obj}
                              hide={["project"]}
                              custom={{
                                  'deleted':'checkmark',
                                  'completed':'checkmark',
                                  'notes':'paragraph'
                              }}
    />
}
