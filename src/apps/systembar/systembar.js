import "./systembar.css"

import React, {useContext, useEffect, useState} from 'react'
import {MenuBar, MenuBarButton, Spacer} from '../../ui/ui.js'
import {DBContext} from '../../db.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../../query2.js'
import {CATEGORIES} from '../../schema.js'

import {format} from 'date-fns'
import {AppLauncherContext} from '../../services/AppLauncherService.js'
import {NetworkMenu} from '../../NetworkMenu.js'
import {SoundMenu} from '../../SoundMenu.js'


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
    return <MenuBar grow center>
        <label className={'clock'}>{format(time,"eee MMM  dd, hh:mm aa")}</label>
        <MenuBarButton icon={'wifi'}>
            <NetworkMenu/>
        </MenuBarButton>
        <MenuBarButton icon={'volume_down'}>
            <SoundMenu/>
        </MenuBarButton>
        <Spacer/>
        <MenuBarButton icon={'code'} onClick={()=>launch("CommandBar3")}/>
        <MenuBarButton icon={'settings'} onClick={()=>launch("SettingsApp")}/>
        <MenuBarButton icon={'bug_report'} onClick={()=>launch("DebugPanel")}/>
    </MenuBar>
}