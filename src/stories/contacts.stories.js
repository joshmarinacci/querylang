import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {ContactList} from '../apps/contacts.js'


export default {
    title: 'QueryOS/Apps',
    component: ContactList,
    argTypes: {
    },
};

let db = makeDB()
let pm = new PopupManager()

export const ContactsSimple = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <ContactList/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
