import React, {useState} from 'react'
import {HBox, Toolbar, VBox} from '../ui/ui.js'
import {genid} from '../data.js'
import {flatten} from '../util.js'
import {THEME_SCHEMA, ThemeTester} from "../ui/themetester.js"
import {DBContext, makeDB, useDBChanged} from '../db.js'
import {StandardEditPanel} from '../ui/StandardEditPanel.js'
import "../ui/themetester.css"
import "../ui/grid3layout.css"
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
export default {
    title: 'QueryOS/ThemeTester',
    component: ThemeTester,
    argTypes: {
    },
};


function gen_local_files() {
    let theme = db.make('THEME','THEME', THEME_SCHEMA)
    return theme
}


let db = makeDB()
let pm = new PopupManager()

export const ThemeTesterSimple = () => {
    let [theme, setTheme] = useState(()=>gen_local_files())
    useDBChanged(db,theme.category)
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <ThemeTester theme={theme} setTheme={setTheme}/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>

}