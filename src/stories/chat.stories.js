import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {Chat} from '../apps/chat.js'


export default {
    title: 'QueryOS/Apps',
    component: Chat,
    argTypes: {
    },
};

let db = makeDB()
let pm = new PopupManager()

export const ChatBasic = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <Chat/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
