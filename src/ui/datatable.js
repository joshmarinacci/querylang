import React from 'react'
import {flatten} from '../util.js'
import "./datatable.css"

export function DataTable({data, selected, setSelected, className, style, stringifyDataColumn, prepend, append, headers}) {

    let cls = {
        'table':true,
    }
    if(className) cls[className] = true
    // if(!stringify) stringify = (s)=>"no stringify"
    if(!setSelected) setSelected = ()=>{}
    style = style || {}

    prepend = prepend || []
    append  = append  || []
    headers = headers || []

    return <table className={flatten(cls)} style={style}>
        <thead>
        <tr>{ headers.map(h => <th key={h}>{h}</th>) }</tr>
        </thead>
        <tbody>
        {data.map(o=> {
            cls.selected = selected&&o&&(selected.id===o.id)
            let values = []
            let cols = Object.keys(o.props)
            cols = prepend.concat(cols)
            cols = cols.concat(append)
            cols.forEach(k => {
                let val = stringifyDataColumn(o,k)
                if(val) values.push(<td key={k}>{val}</td>)
            })
            return <tr key={o.id} onClick={()=>setSelected(o)} className={flatten(cls)}>
                {values}
            </tr>
        })}</tbody>
    </table>

}
