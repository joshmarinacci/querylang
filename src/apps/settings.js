import React, {useContext, useEffect, useRef, useState} from 'react'
import {DBContext, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {Window} from '../ui/window.js'
import {VBox} from '../ui/ui.js'

export function SettingsApp({app}) {
    let db = useContext(DBContext)
    useDBChanged(db, CATEGORIES.TASKS.ID)
    return <Window app={app}>
        <VBox scroll>
            <div>settings here for stuff</div>
        </VBox>
    </Window>
}
