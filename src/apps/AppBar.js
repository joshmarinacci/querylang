import {AND} from '../query2.js'
import {Window} from '../ui/ui.js'
import React, {useContext} from 'react'
import {CATEGORIES} from '../schema.js'
import {DBContext, propAsString} from '../db.js'
import "./appbar.css"
import Icon from '@material-ui/core/Icon'
import {AppLauncherContext} from '../services/AppLauncherService.js'

const isAppCategory = () => ({ CATEGORY:CATEGORIES.APP.ID })
const isApp = () => ({ TYPE:CATEGORIES.APP.TYPES.APP })

const AppView = ({app}) => {
    let appService = useContext(AppLauncherContext)
    const launchApp = () => appService.launch(app)
    return <li onClick={launchApp}>
        <Icon>{propAsString(app,'icon')}</Icon>
        <b>{propAsString(app,'title')}</b>
    </li>
}
const isPropEqual = (prop,value) => ({ equal: {prop, value}})

export function AppBar({}) {
    let db = useContext(DBContext)
    let items = db.QUERY(AND(isAppCategory(),
        isApp(),
        isPropEqual('launchbar',true)))
    let app = {
        id: 1222,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            appid: 'AppBar',
            preload: true,
            launchbar: false,
            window: {
                default_width: 80,
                default_height: items.length*70,
                anchor: 'top-left',
            }
        }
    }

    return <Window resize={false} hide_titlebar={true} app={app}>
        <ul className={'list'}>{items.map(o => <AppView key={o.id} app={o}/>)}</ul>
    </Window>
}