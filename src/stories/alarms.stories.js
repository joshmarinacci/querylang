import {ThemeTester} from '../ui/themetester.js'
import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import {Alarms} from '../apps/alarms.js'
import React from 'react'
import "../ui/themetester.css"

export default {
    title: 'QueryOS/Apps',
    component: ThemeTester,
    argTypes: {
    },
};

let db = makeDB()
let pm = new PopupManager()

export const AlarmsBasic = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <Alarms/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
