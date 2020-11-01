import {AND} from './query2.js'
import {CATEGORIES} from './schema.js'
import {Window} from './window.js'
import React, {useContext} from 'react'
import {DBContext, propAsString, useDBChanged} from './db.js'
import {AppLauncherContext} from './services/AppLauncherService.js'

import "./notifications.css"
import {StandardListItem} from './ui.js'

const isPropEqual = (prop,value) => ({ equal: {prop, value}})

export function NotificationPanel({app}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.NOTIFICATION.ID)
    let appService = useContext(AppLauncherContext)
    let items = db.QUERY(AND(
        {CATEGORY:CATEGORIES.NOTIFICATION.ID},
        {TYPE:CATEGORIES.NOTIFICATION.TYPES.ALERT},
        isPropEqual('read',false),
    ))

    return <Window width={200} height={326} anchor={'bottom-right'}  className={"notification-panel"} resize={false} hide_titlebar={true} app={app} appService={appService}>
        <ul className={'list'}>{items.map((o,i) => <NotificationView key={i} alert={o}/>)}</ul>
    </Window>
}

function NotificationView({alert}) {
    let db = useContext(DBContext)
    const closeAlert = () => db.setProp(alert,'read',true)
    return <StandardListItem
        title={propAsString(alert,'title')}
        icon={propAsString(alert,'icon')}
        trailingIcon={"close"}
        onClickTrailingIcon={closeAlert}
        />
}