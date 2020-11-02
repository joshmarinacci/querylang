import React from 'react'
import {DataList, EnumPropEditor, HBox, Spacer, TextPropEditor, Toolbar, VBox, Window} from './ui.js'
import {propAsBoolean, propAsString, useDBChanged} from './db.js'
import {AND} from './query2.js'
import {CATEGORIES} from './schema.js'
import {Icon} from '@material-ui/core'

import {format, isWithinInterval, setHours, getHours, setMinutes, getMinutes, isAfter, isBefore,
    subDays, addDays, addMinutes, setMilliseconds, setSeconds,
    startOfDay, endOfDay,
} from 'date-fns'

const isAlarm = () => ({ TYPE:CATEGORIES.ALARM.TYPES.ALARM })
const isAlarmCategory = () => ({ CATEGORY:CATEGORIES.ALARM.ID })

/*

//show all alarms
//add a new alarm
//alarm needs a time
//alarm needs description
//enable and disable using checkbox or other icon
//list of alarms
//button to add alarm
//button to delete alarm
//edit title of alarm
//disable or enable alarms

have an alarm service that prints to the console when alarm happens
update every second

 */

export function Alarms({db, app, appService}) {
    useDBChanged(db,CATEGORIES.ALARM.ID)

    let alarms = db.QUERY(AND(isAlarm(), isAlarmCategory()))
    const addAlarm = () => {
        let task = db.make(CATEGORIES.ALARM.ID, CATEGORIES.ALARM.TYPES.ALARM)
        db.add(task)
    }
    return <Window width={400} height={200} app={app} appService={appService} resize>
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
        console.log("deleting")
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