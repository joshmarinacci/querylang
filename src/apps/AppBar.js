import {AND} from '../query2.js'
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
    return <li onClick={launchApp} datatype={propAsString(app,'appid')}>
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
    //TODO: resize to fit proper height = items.length*70 ?,
    return <ul className={'list'}>{items.map(o => <AppView key={o.id} app={o}/>)}</ul>
}