import {Window} from './window.js'
import React, {useContext} from 'react'
import {DBContext} from './db.js'

export function DebugPanel({db, app, appService}) {
    let ddb = useContext(DBContext)
    return <Window app={app}>
        <button className={'primary'} onClick={()=>ddb.persist()}>persist</button>
        <button className={'primary'} onClick={()=>ddb.reload()}>reload</button>
        <button className={'danger'} onClick={()=>ddb.nukeAndReload()}>nuke and reload storage</button>
    </Window>

}
