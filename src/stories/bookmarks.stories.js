import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {BookmarksManager} from '../apps/bookmarks/bookmarks.js'

export default {
    title: 'QueryOS/Apps',
    component: BookmarksManager,
    argTypes: {
    },
};

let db = makeDB()
let pm = new PopupManager()

export const BookmarksBasic = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <BookmarksManager/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
