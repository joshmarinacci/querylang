import React, {useContext, useState} from 'react'
import {Window} from '../window.js'
import {DBContext} from '../db.js'

export function CommandBar({app}) {
    const db = useContext(DBContext)

    return <Window app={app}>
        type here
    </Window>

}