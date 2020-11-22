import React from 'react'
import {FileBrowser} from '../ui/filebrowser.js'
import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import {DialogContainer, DialogManager, DialogManagerContext} from '../ui/DialogManager.js'

export default {
    title: 'QueryOS/FileBrowser',
    component: FileBrowser,
    argTypes: {
    },
};


let db = makeDB()
let pm = new PopupManager()
let dm = new DialogManager()

export const FileBrowserSimple = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <DialogManagerContext.Provider value={dm}>
                <FileBrowser/>
                <PopupContainer/>
                <DialogContainer/>
            </DialogManagerContext.Provider>
        </PopupManagerContext.Provider>
    </DBContext.Provider>

}