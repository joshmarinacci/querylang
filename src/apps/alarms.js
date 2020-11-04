import React, {useContext} from 'react'
import {DataList, EnumPropEditor, HBox, Spacer, TextPropEditor, Toolbar, VBox, Window} from '../ui.js'
import {DBContext, propAsBoolean, useDBChanged} from '../db.js'
import {AND} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import {Icon} from '@material-ui/core'

import {format} from 'date-fns'

const isAlarm = () => ({ TYPE:CATEGORIES.ALARM.TYPES.ALARM })
const isAlarmCategory = () => ({ CATEGORY:CATEGORIES.ALARM.ID })

export function Alarms({app}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.ALARM.ID)

    let alarms = db.QUERY(AND(isAlarm(), isAlarmCategory()))
    const addAlarm = () => db.add(db.make(CATEGORIES.ALARM.ID, CATEGORIES.ALARM.TYPES.ALARM))
    return <Window app={app}>
        <VBox grow>
            <Toolbar>
                <button onClick={addAlarm}><Icon>alarm_add</Icon></button>
                <Spacer/>
            </Toolbar>
            <DataList data={alarms} stringify={(o)=> <AlarmItem key={o.id} alarm={o} db={db}/>}/>
        </VBox>
    </Window>
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