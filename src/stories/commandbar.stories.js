import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {CommandBar3} from '../apps/CommandBar3.js'
let db = makeDB()
let pm = new PopupManager()

export default {
    title: 'QueryOS/CommandBar',
    component: CommandBar3,
    argTypes: {
    },
};



export const CommandBarExample = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <CommandBar3/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
