import React, {useEffect, useState} from 'react'
import {THEME_SCHEMA, ThemeTester} from "../ui/themetester.js"
import {DBContext, decode_props_with_types, makeDB, useDBChanged} from '../db.js'
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


    const doLoad = () => {
        let localJSON = localStorage.getItem('theme-tester')
        console.log("local is",localJSON)
        let local = JSON.parse(localJSON,function(key,value) {
            if(key === 'props') return decode_props_with_types(value);
            return value
        })

        console.log("local data is",local)
        if(local) setTheme(local)
    }

    useEffect(()=>{
        console.log("doing it once")
        doLoad()
    },[])

    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <ThemeTester theme={theme} setTheme={setTheme} doLoad={doLoad}/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>

}