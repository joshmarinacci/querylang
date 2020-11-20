import React from 'react';

export function Grid3Layout({children}) {
    return <div className={'grid'}>
        {children}
    </div>
}
export function Grid2Layout({children, toolbar=true, statusbar=true}) {
    let rows = (toolbar?"3em ":"") + " 1fr " + (statusbar?"2em":"")
    let style = {
        'grid-template-columns': '1fr 2fr',
        'grid-template-rows': rows,
    }

    return <div className={'grid2'} style={style}>{children}</div>
}

export const flatten = (obj) => {
    let str = ""
    Object.keys(obj).forEach(k => str += obj[k]?(k + " "):"")
    return str
}
