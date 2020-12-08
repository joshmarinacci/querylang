import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {CommandBar3} from '../apps/CommandBar3.js'
import {PeopleBar} from '../apps/peoplebar.js'
let db = makeDB()
let pm = new PopupManager()

export default {
    title: 'QueryOS/Apps',
    component: PeopleBar,
    argTypes: {
    },
};



export const PeopleBarSimple = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <PeopleBar/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
