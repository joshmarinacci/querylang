import React from 'react';
import Icon from '@material-ui/core/Icon'

/*
 - draggable title bar
 - toolbar integrated with title bar or below it?
 - sidebar 1
 - sidebar 2
 - main content area
 - status bar
 - accent color
 - expands to fill the window
 - dialogs overlay and it turns gray

 */
import "./grid3layout.css"
import {Spacer} from './ui.js'

export function Grid3Layout({children}) {
    return <div className={'grid3layout'}>
        {children}
    </div>
}

export const flatten = (obj) => {
    let str = ""
    Object.keys(obj).forEach(k => str += obj[k]?(k + " "):"")
    return str
}
