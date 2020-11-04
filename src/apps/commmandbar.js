import React, {useContext, useRef, useState} from 'react'
import {Window} from '../window.js'
import {DBContext} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../query2.js'
import {AppLauncherContext} from '../services/AppLauncherService.js'
import {DataList} from '../ui.js'
import {PopupManagerContext} from '../PopupManager.js'

export function CommandBar({app}) {
    const db = useContext(DBContext)
    const appservice = useContext(AppLauncherContext)
    const pm = useContext(PopupManagerContext)

    let [text,setText] = useState("")
    let [showing, setShowing] = useState(false)
    let [apps, setApps] = useState([])
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
        setShowing(false)
        setApps([])
        setText("")
        pm.hide()
    }

    function complete() {
        setShowing(true)
        let apps = db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.APP.ID),
            IS_TYPE(CATEGORIES.APP.TYPES.APP),
        ))
        apps = apps.filter(a => a.props.appid.toLowerCase().indexOf(text.toLowerCase())===0)
        console.log("found",apps.map(a => a.props.appid))
        setApps(apps)
        if(apps.length === 1) {
            console.log("finish completing")
            setText(apps[0].props.appid)
        }
    }

    if(showing) {
        pm.show(<DataList data={apps} stringify={o => o.props.appid}/>, textfield.current)
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