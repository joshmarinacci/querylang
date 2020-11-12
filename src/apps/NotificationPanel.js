import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import {Window} from '../ui/window.js'
import React, {useContext} from 'react'
import {DBContext, propAsString, useDBChanged} from '../db.js'

import "../notifications.css"
import {StandardListItem, VBox} from '../ui/ui.js'

export function NotificationPanel({app}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.NOTIFICATION.ID)
    let items = db.QUERY(AND(
        IS_CATEGORY(CATEGORIES.NOTIFICATION.ID),
        IS_TYPE(CATEGORIES.NOTIFICATION.TYPES.ALERT),
        IS_PROP_EQUAL('read',false),
    ))

    return <VBox className={'list'}>{items.map((o,i) => <NotificationView key={i} alert={o}/>)}</VBox>
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