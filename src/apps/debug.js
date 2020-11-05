import {Window} from '../ui/window.js'
import React, {useContext} from 'react'
import {DBContext} from '../db.js'

export function DebugPanel({app}) {
    let db = useContext(DBContext)
    return <Window app={app}>
        <button className={'primary'} onClick={()=>db.persist()}>persist</button>
        <button className={'primary'} onClick={()=>db.reload()}>reload</button>
        <button className={'danger'} onClick={()=>db.nukeAndReload()}>nuke and reload storage</button>
    </Window>

}
