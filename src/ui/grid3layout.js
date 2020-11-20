import React from 'react';

export function Grid3Layout({children}) {
    return <div className={'grid3layout grid'}>
        {children}
    </div>
}

export const flatten = (obj) => {
    let str = ""
    Object.keys(obj).forEach(k => str += obj[k]?(k + " "):"")
    return str
}
