import "./systembar.css"

import React, {useContext, useEffect, useState} from 'react'
import {HBox, Spacer, Toolbar, Window} from '../../ui/ui.js'
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
    return <Window app={app} hide_titlebar={true} resize={false}>
        <Toolbar grow center>
            <label className={'clock'}>{format(time,"eee MMM  dd hh:mm aa")}</label>
            <Spacer/>
            <Icon onClick={()=>launch("CommandBar")}>code</Icon>
            <Icon onClick={()=>launch("SettingsApp")}>settings</Icon>
            <Icon onClick={()=>launch("DebugPanel")}>bug_report</Icon>
        </Toolbar>
    </Window>
}