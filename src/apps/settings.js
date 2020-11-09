import React, {useContext, useEffect, useRef, useState} from 'react'
import {DBContext, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {Window} from '../ui/window.js'
import {Toolbar, VBox} from '../ui/ui.js'

export function SettingsApp({app}) {
    let db = useContext(DBContext)
    useDBChanged(db, CATEGORIES.TASKS.ID)
    let [panel,setPanel] = useState("background")
    return <Window app={app}>
        <VBox scroll>
            <Toolbar>
                <button onClick={()=>setPanel("background")}>background</button>
            </Toolbar>
            {renderPanel(panel)}
        </VBox>
    </Window>
}



function renderPanel(panel) {
    if(panel === 'background') {
        return <div>background</div>
    }
    return <div>nothing</div>
}
