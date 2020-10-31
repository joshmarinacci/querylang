import {AND} from './query2.js'
import {CATEGORIES} from './schema.js'
import {Window} from './window.js'
import React from 'react'
import {propAsString} from './db.js'

export function NotificationPanel({db, app, appService}) {
    let items = db.QUERY(AND(
        {CATEGORY:CATEGORIES.NOTIFICATION.ID},
        {TYPE:CATEGORIES.NOTIFICATION.TYPES.ALERT},
    ))

    return <Window width={200} height={326} anchor={'bottom-right'}  className={"notification-panel"} resize={false} hide_titlebar={true} app={app} appService={appService}>
        <ul className={'list'}>{items.map(o => {
            return propAsString(o,'title')
        })}</ul>
    </Window>
}