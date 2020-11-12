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
export function Grid3Layout({}) {
    return <div className={'grid3layout'}>
        <TitleBar title={'some title'}/>
        <SourceList column={1} secondary/>

        <TopToolbar column={2}>
            <label>Inbox</label>
            <Spacer/>
            <Icon>filter_list</Icon>
        </TopToolbar>
        <SourceList column={2}/>

        <TopToolbar column={3}>
            <Icon>email</Icon>
            <Icon>create</Icon>
            <Spacer/>
            <Icon>archive</Icon>
            <Icon>delete</Icon>
            <Spacer/>
            <Icon>search</Icon>
        </TopToolbar>
        <ContentArea column={3}/>
    </div>
}

export const flatten = (obj) => {
    let str = ""
    Object.keys(obj).forEach(k => str += obj[k]?(k + " "):"")
    return str
}


function TitleBar({title}) {
    return <div className={'titlebar'}>{title}</div>
}
function SourceList({column, secondary}) {
    let data = []
    for(let i=0; i<20; i++) {
        data.push(`line ${i}`)
    }
    let cls = `source-list col${column}`
    if(secondary) cls += ' secondary'
    return <ul className={cls}>{data.map((o,i)=><li key={i} className={flatten({selected:i===2})}>{o}</li>)}</ul>
}
function TopToolbar({column, children}) {
    let cls = `toolbar col${column}`
    return <div className={cls}>
        {children}
    </div>
}
function ContentArea({column}) {
    let cls = `content-area col${column}`
    return <div className={cls}>this is some big and cool content</div>
}