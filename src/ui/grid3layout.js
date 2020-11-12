import React from 'react';

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
export function Grid3Layout({}) {
    return <div className={'grid3layout'}>
        <TitleBar/>
        <SourceList column={1} secondary/>

        <TopToolbar column={2}/>
        <SourceList column={2}/>

        <TopToolbar column={3}/>
        <ContentArea column={3}/>
    </div>
}

export const flatten = (obj) => {
    let str = ""
    Object.keys(obj).forEach(k => str += obj[k]?(k + " "):"")
    return str
}


function TitleBar() {
    return <div className={'titlebar'}>title</div>
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
function TopToolbar({column}) {
    let cls = `toolbar col${column}`
    return <div className={cls}>
        <button>do</button>
        <button>cool</button>
        <button>things</button>
    </div>
}
function ContentArea({column}) {
    let cls = `content-area col${column}`
    return <div className={cls}>this is some big and cool content</div>
}