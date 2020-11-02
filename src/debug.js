import {Window} from './window.js'
import React, {useContext} from 'react'
import {DBContext} from './db.js'

export function DebugPanel({db, app, appService}) {
    let ddb = useContext(DBContext)
    return <Window width={200} height={200} anchor={'bottom-left'}  className={"debug-panel"} app={app} appService={appService}>
        <button className={'primary'} onClick={()=>ddb.persist()}>persist</button>
        <button className={'primary'} onClick={()=>ddb.reload()}>reload</button>
        <button className={'danger'} onClick={()=>ddb.nukeAndReload()}>nuke and reload storage</button>
    </Window>

}
