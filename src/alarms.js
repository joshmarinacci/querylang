import React from 'react'
import {DataList, HBox, Window} from './ui.js'
import {propAsString, useDBChanged} from './db.js'
import {AND} from './query2.js'
import {CATEGORIES} from './schema.js'
import {Icon} from '@material-ui/core'

const isAlarm = () => ({ TYPE:CATEGORIES.ALARM.TYPES.ALARM })
const isAlarmCategory = () => ({ CATEGORY:CATEGORIES.ALARM.ID })


export function Alarms({db, app, appService}) {
    useDBChanged(db,CATEGORIES.ALARM.ID)

    let alarms = db.QUERY(AND(isAlarm(), isAlarmCategory()))
    const addAlarm = () => {
        let task = db.make(CATEGORIES.ALARM.ID, CATEGORIES.ALARM.TYPES.ALARM)
        db.add(task)
    }
    return <Window width={300} height={200} app={app} appService={appService}>
        <HBox grow>
            <button onClick={addAlarm}><Icon>alarm_add</Icon></button>
            <DataList data={alarms} stringify={(o)=>{
                return <HBox>
                    <label>{propAsString(o,'time')}</label>
                    <label>{propAsString(o,'repeat')}</label>
                    <button><Icon>delete</Icon></button>
                </HBox>
            }}/>
        </HBox>
    </Window>
}
