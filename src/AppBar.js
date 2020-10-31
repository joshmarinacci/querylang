import {AND} from './query2.js'
import {Window} from './ui.js'
import React, {useContext} from 'react'
import {CATEGORIES} from './schema.js'
import {DBContext, propAsString} from './db.js'
import "./appbar.css"
import Icon from '@material-ui/core/Icon'
import {AppLauncherContext} from './services/AppLauncherService.js'

const isAppCategory = () => ({ CATEGORY:CATEGORIES.APP.ID })
const isApp = () => ({ TYPE:CATEGORIES.APP.TYPES.APP })

const AppView = ({app, service}) => {
    const launchApp = () => service.launch(app)
    return <li onClick={launchApp}>
        <Icon>{propAsString(app,'icon')}</Icon>
        <b>{propAsString(app,'title')}</b>
    </li>
}
const isPropEqual = (prop,value) => ({ equal: {prop, value}})

export function AppBar({}) {
    let db = useContext(DBContext)
    let appService = useContext(AppLauncherContext)
    let items = db.QUERY(AND(isAppCategory(),
        isApp(),
        isPropEqual('launchbar',true)))
    return <Window width={80} height={items.length*70} y={0} x={0} title={'apps'} className={"appbar"} resize={false} hide_titlebar={true}>
        <ul className={'list'}>{items.map(o => <AppView key={o.id} app={o} service={appService}/>)}</ul>
    </Window>
}