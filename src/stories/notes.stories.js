import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {Notes} from '../apps/notes.js'


export default {
    title: 'QueryOS/Apps',
    component: Notes,
    argTypes: {
    },
};

let db = makeDB()
let pm = new PopupManager()

export const NotesBasic = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <Notes/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
