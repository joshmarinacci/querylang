import {Window} from './window.js'
import React, {useContext} from 'react'
import {DBContext} from './db.js'

export function DebugPanel({db, app, appService}) {
    let ddb = useContext(DBContext)
    return <Window width={200} height={200} anchor={'bottom-left'}  className={"debug-panel"} app={app} appService={appService}>
        <button onClick={()=>ddb.persist()}>persist</button>
        <button onClick={()=>ddb.reload()}>reload</button>
        <button onClick={()=>ddb.nukeAndReload()}>nuke and reload storage</button>
    </Window>

}
