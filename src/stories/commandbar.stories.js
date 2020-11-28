import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {CommandBar2} from '../apps/CommandBar2.js'
let db = makeDB()
let pm = new PopupManager()

export default {
    title: 'QueryOS/CommandBar',
    component: CommandBar2,
    argTypes: {
    },
};



export const CommandBarExample = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <CommandBar2/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
