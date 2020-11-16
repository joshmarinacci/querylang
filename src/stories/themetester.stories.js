import React, {useState} from 'react'
import {HBox, Toolbar, VBox} from '../ui/ui.js'
import {genid} from '../data.js'
import {flatten} from '../util.js'
import {THEME_SCHEMA, ThemeTester} from "../ui/themetester.js"
import {DBContext, makeDB, useDBChanged} from '../db.js'
import {StandardEditPanel} from '../ui/StandardEditPanel.js'

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

export const ThemeTesterSimple = () => {
    let [theme] = useState(()=>gen_local_files())
    useDBChanged(db,theme.category)
    return <DBContext.Provider value={db}>
        <ThemeTester theme={theme}/>
    </DBContext.Provider>

}