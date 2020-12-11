import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import React, {useContext} from 'react'
import {DBContext, propAsString, useDBChanged} from '../db.js'

import "../notifications.css"
import {DataList, StandardSourceItem} from '../ui/dataList.js'

export function NotificationPanel({app}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.NOTIFICATION.ID)
    let items = db.QUERY(AND(
        IS_CATEGORY(CATEGORIES.NOTIFICATION.ID),
        IS_TYPE(CATEGORIES.NOTIFICATION.TYPES.ALERT),
        IS_PROP_EQUAL('read',false),
    ))


    return <DataList data={items} renderItem={({item,...rest})=>{
        const closeAlert = (alert) => db.setProp(alert,'read',true)
        return <StandardSourceItem
            icon={propAsString(item,'icon')}
            title={propAsString(item,'title')}
            trailing_icon={'close'}
            onClick={()=>closeAlert(item)}
        />
    }}/>
}