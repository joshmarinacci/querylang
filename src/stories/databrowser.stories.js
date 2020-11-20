import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {DataBrowser} from '../apps/DataBrowser.js'

export default {
    title: 'QueryOS/Apps',
    component: DataBrowser,
    argTypes: {
    },
};

let db = makeDB()
let pm = new PopupManager()

export const DataBrowserBasic = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <DataBrowser/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
