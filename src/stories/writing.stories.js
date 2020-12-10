import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {WriterApp} from '../apps/writing.js'


export default {
    title: 'QueryOS/Apps',
    component: WriterApp,
    argTypes: {
    },
};

let db = makeDB()
let pm = new PopupManager()

export const WriterAppSimple = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <WriterApp/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
