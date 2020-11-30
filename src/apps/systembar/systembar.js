import "./systembar.css"

import React, {useContext, useEffect, useState} from 'react'
import {Spacer, Toolbar} from '../../ui/ui.js'
import {DBContext} from '../../db.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../../query2.js'
import {CATEGORIES} from '../../schema.js'
import {Icon} from '@material-ui/core'

import {format} from 'date-fns'
import {AppLauncherContext} from '../../services/AppLauncherService.js'


export function SystemBar({app}) {
    let appService = useContext(AppLauncherContext)
    let db = useContext(DBContext)

    const  [time, setTime] = useState(new Date())

    const launch = (name) => {
        let apps = db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.APP.ID),
            IS_TYPE(CATEGORIES.APP.TYPES.APP),
            IS_PROP_EQUAL('appid', name)
        ))
        appService.launch(apps[0])
    }
    const update = () => {
        setTime(new Date())
    }
    useEffect(()=>{
        let t = setTimeout(update,10*1000)
        return () => {
            clearTimeout(t)
        }
    })
    return <Toolbar grow center>
        <div className={'grp'}>
            <label className={'clock'}>{format(time,"eee MMM  dd, hh:mm aa")}</label>
        </div>
        <Spacer/>
        <div className={'grp'}>
            <Icon onClick={()=>launch("CommandBar3")}>code</Icon>
            <Icon onClick={()=>launch("SettingsApp")}>settings</Icon>
            <Icon onClick={()=>launch("DebugPanel")}>bug_report</Icon>
        </div>
    </Toolbar>
}