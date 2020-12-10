import React from 'react'
import {flatten} from '../util.js'
import "./datatable.css"
import {hasProp, propAsString} from '../db.js'
import {SORTS} from '../schema.js'
import Icon from '@material-ui/core/Icon'

export function DataTable({data, selected, setSelected, className, style, stringifyDataColumn, prepend, append, headers, sortField, sortDirection,
                              onSortChange,
                              onDoubleClick
                          }) {

    let cls = {
        'table':true,
    }
    if(className) cls[className] = true
    if(!stringifyDataColumn) stringifyDataColumn = (o,k) => {
        if(hasProp(o,k)) return propAsString(o,k)
        return `missing prop ${k}`
    }
    if(!setSelected) setSelected = ()=>{}
    style = style || {}

    prepend = prepend || []
    append  = append  || []
    if(!headers && data && data.length > 0) {
        let props = data[0].props
        headers = Object.keys(props)
    }
    headers = headers || []

    return <table className={flatten(cls)} style={style}>
        <thead>
        <tr>{ headers.map(h => <DataTableHeader key={h} onSortChange={onSortChange} prop={h} sortField={sortField} sortDirection={sortDirection}/>) }</tr>
        </thead>
        <tbody
            onKeyDown={e=>{
                let i = data.findIndex(d => d.id === selected.id)
                if(e.key === 'ArrowDown' && i < data.length-1) {
                    setSelected(data[i+1])
                    e.preventDefault()
                }
                if(e.key === 'ArrowUp' && i > 0) {
                    setSelected(data[i-1])
                    e.preventDefault()
                }
            }}
        >
        {data.map(o=> {
            cls.selected = selected&&o&&(selected.id===o.id)
            let values = []
            let cols = Object.keys(o.props)
            cols = prepend.concat(cols)
            cols = cols.concat(append)
            cols.forEach(k => {
                let val = stringifyDataColumn(o,k)
                if(val) values.push(<td key={k} >{val}</td>)
            })
            return <tr
                key={o.id}
                onClick={()=>setSelected(o)}
                onDoubleClick={()=>onDoubleClick?onDoubleClick(o):""}
                tabIndex={0}
                className={flatten(cls)}>
                {values}
            </tr>
        })}</tbody>
    </table>

}


function DataTableHeader({prop, onSortChange, sortField, sortDirection}) {
    let sorted = prop===sortField
    let cls = {
        ['sort-column']:sorted,
    }
    let icon = ""
    if(sorted) {
        if(sortDirection === SORTS.ASCENDING) {
            icon = "expand_less"
        } else {
            icon = "expand_more"
        }
    }
    return <th
        className={flatten(cls)}
        onClick={()=>{
            if(onSortChange) onSortChange(prop)
        }}
    >{prop} <Icon>{icon}</Icon></th>
}