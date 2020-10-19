import {AND, query2 as QUERY} from './query2.js'
import {Window} from './ui.js'
import React from 'react'
import {CATEGORIES} from './schema.js'
import {propAsString} from './db.js'
import "./appbar.css"

const isAppCategory = () => ({ CATEGORY:CATEGORIES.APP.ID })
const isApp = () => ({ TYPE:CATEGORIES.APP.TYPES.APP })

const AppView = ({app, service}) => {
    const launchApp = () => service.launch(app)
    return <li onClick={launchApp}>{propAsString(app,'title')}</li>
}
export function AppBar({db, appService}) {
    let items = db.QUERY(AND(isAppCategory(), isApp()))
    return <Window width={100} height={items.length*100} y={0} x={0} title={'apps'} className={"appbar"} resize={false} hide_titlebar={true}>
        <ul className={'list'}>{items.map(o => <AppView key={o.id} app={o} service={appService}/>)}</ul>
    </Window>
}