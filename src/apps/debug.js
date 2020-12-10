import React, {useContext, useState} from 'react'
import {DBContext, setProp} from '../db.js'
import {Spacer, VBox} from '../ui/ui.js'
import {AppLauncherContext} from '../services/AppLauncherService.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import {genid} from '../data.js'
import {PERSIST_SERVER_URL} from '../globals.js'
import {post_json_with_auth} from '../util.js'

let datasets = [
    {
        id:genid('dataset'),
        key:'dataset1',
        title:"personal",
    },
    {
        id:genid('dataset'),
        key:'dataset2',
        title:"testing",
    }
]


export function DebugPanel({app}) {
    let db = useContext(DBContext)
    let appService = useContext(AppLauncherContext)
    let [ds, set_ds] = useState(datasets[0])

    const launch = (name) => {
        let apps = db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.APP.ID),
            IS_TYPE(CATEGORIES.APP.TYPES.APP),
            IS_PROP_EQUAL('appid', name)
        ))
        appService.launch(apps[0])
    }

    return <VBox className={'panel'} grow>
        <select value={ds.key} onChange={e => {
            set_ds(datasets.find(d => d.key===e.target.value))
        }}>{datasets.map(ds => <option key={ds.id} value={ds.key}>{ds.title}</option>)}</select>
        <button className={'primary'} onClick={()=>{
            db.persist(ds.key)
            let alert = db.make(CATEGORIES.NOTIFICATION.ID, CATEGORIES.NOTIFICATION.TYPES.ALERT)
            setProp(alert,'title','saved to local storage')
            db.add(alert)
        }}>persist</button>
        <button className={'primary'} onClick={()=>{
            post_json_with_auth(PERSIST_SERVER_URL+'/save/myjson',db.persist_to_plainobject()).then(d => {
                console.log("data response is",d)
            })
        }}>persist remote</button>
        <button className={'primary'} onClick={()=>db.reload(ds.key)}>reload</button>
        <button className={'primary'} onClick={()=>launch("DataBrowser")}>data browser</button>
        <Spacer/>
        <button className={'danger'} onClick={()=>db.nukeAndReload(ds.key)}>nuke and reload storage</button>
    </VBox>
}
