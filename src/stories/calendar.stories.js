import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {Calendar} from '../apps/calendar.js'

export default {
    title: 'QueryOS/Apps',
    component: Calendar,
    argTypes: {
    },
};

let db = makeDB()
let pm = new PopupManager()

export const CalendarBasic = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <Calendar/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
