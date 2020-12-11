import React from 'react';

import "./grid3layout.css"

export function Grid3Layout({children, toolbar=true, statusbar=true}) {
    let rows = `${toolbar?'3em':''} 1fr ${statusbar?'2em':''}`
    let style = {
        gridTemplateColumns: '15em 2fr 3fr',
        gridTemplateRows: rows,
    }
    return <div className={'grid'} style={style}>{children}</div>
}
export function Grid2Layout({children, toolbar=true, statusbar=true}) {
    let rows = `${toolbar?'3em':''} 1fr ${statusbar?'2em':''}`
    let style = {
        gridTemplateColumns: '1fr 2fr',
        gridTemplateRows: rows,
    }

    return <div className={'grid2'} style={style}>{children}</div>
}

export const flatten = (obj) => {
    let str = ""
    Object.keys(obj).forEach(k => str += obj[k]?(k + " "):"")
    return str
}
