import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import React from 'react'
import "../ui/themetester.css"
import {Music} from '../apps/music.js'

export default {
    title: 'QueryOS/Apps',
    component: Music,
    argTypes: {
    },
};

let db = makeDB()
let pm = new PopupManager()

export const MusicBasic = () => {
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <Music/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>
}
