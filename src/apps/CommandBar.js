import React, {useContext, useRef, useState} from 'react'
import {Window} from '../ui/window.js'
import {DBContext} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../query2.js'
import {AppLauncherContext} from '../services/AppLauncherService.js'
import {VBox} from '../ui/ui.js'
import {PopupManagerContext} from '../ui/PopupManager.js'

function ItemMenu({data, onChoose}) {
    return <VBox>
        {data.map((it,i) => {
            return <button onClick={()=>onChoose(it)}>{it.props.title}</button>
        })}
    </VBox>
}
export function CommandBar({app}) {
    const db = useContext(DBContext)
    const appservice = useContext(AppLauncherContext)
    const pm = useContext(PopupManagerContext)

    let [text,setText] = useState("")
    let textfield = useRef()
    const update = (e,txt) => {
        setText(txt)
    }

    function execute() {
        let apps = db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.APP.ID),
            IS_TYPE(CATEGORIES.APP.TYPES.APP),
            IS_PROP_EQUAL('appid',text)
        ))
        console.log("running",text,apps)
        if(apps.length > 0) {
            let app = apps[0]
            appservice.launch(app)
        }
        setText("")
        pm.hide()
    }

    function complete() {
        let apps = db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.APP.ID),
            IS_TYPE(CATEGORIES.APP.TYPES.APP),
        ))
        apps = apps.filter(a => a.props.appid.toLowerCase().indexOf(text.toLowerCase())===0)
        pm.show(<ItemMenu data={apps} onChoose={(ap)=>{
            setText(ap.props.appid)
            pm.hide()
        }
        }/>, textfield.current)
        if(apps.length === 1) {
            setText(apps[0].props.appid)
        }
    }


    return <Window app={app}>
        <input ref={textfield}
            type={'text'} value={text} onChange={e => update(e,e.target.value)}
               onKeyDownCapture={e => {
                   if(e.key === 'Tab') {
                       complete()
                       e.preventDefault()
                   }
                   if(e.key === 'ArrowDown') {
                       console.log("down")
                   }
               }}
               onKeyPress={e => {
                   if(e.key === 'Enter') {
                       console.log("pressed enter")
                       execute()
                   }
               }}
        />
    </Window>

}