import React, {useState} from 'react'
import {HBox, Toolbar, VBox} from '../ui/ui.js'
import {genid} from '../data.js'
import {flatten} from '../util.js'
import {FileBrowser} from '../ui/filebrowser.js'
import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import {Calendar} from '../apps/calendar.js'
import {CATEGORIES} from '../schema.js'

export default {
    title: 'QueryOS/FileBrowser',
    component: FileBrowser,
    argTypes: {
    },
};


let db = makeDB()
let pm = new PopupManager()

export const FileBrowserSimple = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <FileBrowser/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>

}