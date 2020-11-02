import React from 'react'
import {AND} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import {getHours, getMinutes, isAfter, setHours, setMilliseconds, setMinutes, setSeconds} from 'date-fns'
import {propAsString, setProp} from '../db.js'

export class AlarmService {
    constructor(db) {
        if(!db) throw new Error("AlarmService requires the database")
        this.db = db
        this.listeners = []
        this.handler = () => this.processAlarms()
        this.interval = setInterval(this.handler,15*1000) //every 15 seconds
    }
    addEventListener(handler) {
        this.listeners.push(handler)
    }
    removeEventListener(handler) {
        this.listeners = this.listeners.filter(l => l !== handler)
    }

    processAlarms() {
        console.log("processing alarms")
        const isAlarm = () => ({ TYPE:CATEGORIES.ALARM.TYPES.ALARM })
        const isAlarmCategory = () => ({ CATEGORY:CATEGORIES.ALARM.ID })

        let alarms = this.db.QUERY(AND(isAlarmCategory(),isAlarm()))
        // console.log("current alarms",alarms)
        let now = new Date()
        // now = setSeconds(now,0)
        now = setMilliseconds(now,0)
        alarms.forEach(alarm => {
            // console.log("checking alarm",alarm)
            let then = Date.now()
            then = setHours(then,getHours(alarm.props.time))
            then = setMinutes(then, getMinutes(alarm.props.time))
            then = setSeconds(then, 0)
            then = setMilliseconds(then, 0)
            // console.log("comparing",format(now,'hh:mm:ss'),format(then,'hh:mm:ss'), "alerted = ", alarm.props.alerted)

            if(isAfter(now,then) && alarm.props.alerted === false) {
                this.db.setProp(alarm, 'alerted', true)
                console.log("alarm rang")
                let alert = this.db.make(CATEGORIES.NOTIFICATION.ID, CATEGORIES.NOTIFICATION.TYPES.ALERT)
                setProp(alert,'title',propAsString(alarm,'title'))
                this.db.add(alert)
            }
        })
        // if previous was < midnight and now is >= midnight set all alerted back to false
    }
}


export const AlarmContext = React.createContext('alarm')
