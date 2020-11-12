import {Window} from '../ui/window.js'
import React, {useContext} from 'react'
import {DBContext, setProp} from '../db.js'
import {Spacer, VBox} from '../ui/ui.js'
import {AppLauncherContext} from '../services/AppLauncherService.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../query2.js'
import {CATEGORIES} from '../schema.js'

export function DebugPanel({app}) {
    let db = useContext(DBContext)
    let appService = useContext(AppLauncherContext)

    const launch = (name) => {
        let apps = db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.APP.ID),
            IS_TYPE(CATEGORIES.APP.TYPES.APP),
            IS_PROP_EQUAL('appid', name)
        ))
        appService.launch(apps[0])
    }

    return <VBox className={'content-panel'} grow>
        <button className={'primary'} onClick={()=>{
            db.persist()
            let alert = db.make(CATEGORIES.NOTIFICATION.ID, CATEGORIES.NOTIFICATION.TYPES.ALERT)
            setProp(alert,'title','saved to local storage')
            db.add(alert)
        }}>persist</button>
        <button className={'primary'} onClick={()=>db.reload()}>reload</button>
        <button className={'primary'} onClick={()=>launch("DataBrowser")}>data browser</button>
        <Spacer/>
        <button className={'danger'} onClick={()=>db.nukeAndReload()}>nuke and reload storage</button>
    </VBox>
}
