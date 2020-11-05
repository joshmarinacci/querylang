import React, {useContext, useEffect, useRef, useState} from 'react'
import {DBContext, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {Window} from '../ui/window.js'
import {Toolbar, VBox} from '../ui/ui.js'

export function WriterApp({app}) {
    let db = useContext(DBContext)
    useDBChanged(db, CATEGORIES.TASKS.ID)

    let [value, setValue] = useState("some words I'm writing")
    return <Window app={app}>
        <Toolbar>
            <button>new?</button>
            <button>save?</button>
        </Toolbar>
        <textarea value={value}/>
    </Window>
}
