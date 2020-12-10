import React, {useContext} from 'react'
import {EnumPropEditor, HBox, Spacer, TextPropEditor, Toolbar, VBox, Window} from '../ui/ui.js'
import {DBContext, propAsBoolean, useDBChanged} from '../db.js'
import {AND, IS_CATEGORY, IS_TYPE} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import {Icon} from '@material-ui/core'

import {format} from 'date-fns'
import './alarms.css'
import {SourceList} from '../ui/sourcelist.js'

export function Alarms({app}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.ALARM.ID)

    let alarms = db.QUERY(AND(IS_CATEGORY(CATEGORIES.ALARM.ID),IS_TYPE(CATEGORIES.ALARM.TYPES.ALARM)))
    const addAlarm = () => db.add(db.make(CATEGORIES.ALARM.ID, CATEGORIES.ALARM.TYPES.ALARM))
    return <VBox grow className={'content-panel'}>
        <Toolbar>
            <button onClick={addAlarm}><Icon>alarm_add</Icon></button>
            <Spacer/>
        </Toolbar>
        <SourceList data={alarms} renderItem={({item,...rest})=>{
            return <AlarmItem key={item.id} alarm={item} db={db} {...rest}/>
        }}/>
    </VBox>
}


function AlarmItem({alarm, db}) {
    const toggleAlarm = () => {
        db.setProp(alarm,"enabled",!propAsBoolean(alarm,'enabled'))
    }
    const deleteAlarm = () => {
        db.remove(alarm)
    }
    return <HBox grow center>
        <Icon onClick={toggleAlarm}>{propAsBoolean(alarm,'enabled')?"toggle_on":"toggle_off"}</Icon>
        <input type={"time"} value={format(alarm.props.time,'hh:mm')}/>
        <TextPropEditor buffer={alarm} prop={'title'} db={db}/>
        <Spacer/>
        <EnumPropEditor buffer={alarm} prop={"repeat"} db={db}/>
        <Icon onClick={deleteAlarm}>delete</Icon>
    </HBox>
}