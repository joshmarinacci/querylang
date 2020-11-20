import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {TaskLists} from '../apps/tasks.js'

export default {
    title: 'QueryOS/Apps',
    component: TaskLists,
    argTypes: {
    },
};

let db = makeDB()
let pm = new PopupManager()

export const TasksBasic = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <TaskLists/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
