import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {Email} from '../apps/email.js'

export default {
    title: 'QueryOS/Apps',
    component: Email,
    argTypes: {
    },
};

let db = makeDB()
let pm = new PopupManager()

export const EmailsBasic = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <Email/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
