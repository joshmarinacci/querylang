import React from 'react'
import {propAsBoolean, propAsString} from './db.js'

export function HBox ({children, grow}) {
    return <div className={'hbox ' + (grow?"grow":"")}>{children}</div>
}
export function VBox ({children, grow}) {
    return <div className={'vbox ' + (grow?"grow":"")}>{children}</div>
}
export function Panel({children, grow}) {
    return <div className={'panel ' + (grow?"grow":"")}>{children}</div>
}
export function Window({x,y,width,height,children,title}) {
    let style = {
        width: width ? (width + "px") : "100px",
        height: height ? (height + "px") : "100px",
        position:'absolute',
        left:x?(x+'px'):'0px',
        top:y?(y+'px'):'0px',
    }
    return <div className={"window"} style={style}>
        <title>{title}</title>
        {children}</div>
}


export function DataList({data, selected, setSelected, stringify}) {
    if(!stringify) stringify = (s)=>"no stringify"
    if(!setSelected) setSelected = ()=>{}
    return <ul className={'list'}>{data.map(o=> {
        return <li key={o.id}
                 onClick={()=>setSelected(o)}
                 className={selected===o?"selected":""}
      >
            {stringify(o)}
      </li>
    })}</ul>

}

export function TextPropEditor({buffer, prop, onChange}) {
    return <HBox>
        <label>{prop}</label>
        <input type="text"
               value={propAsString(buffer, prop)}
               onChange={(ev) => {
                   buffer.props[prop] = ev.target.value
                   onChange(buffer, prop)
               }}
        />

    </HBox>
}

export function CheckboxPropEditor({buffer, prop, onChange}) {
    return <HBox>
        <label>{prop}</label>
        <input type="checkbox"
               checked={propAsBoolean(buffer, prop)}
               onChange={(ev) => {
                   buffer.props[prop] = ev.target.checked
                   onChange(buffer, prop)
               }}
        />
    </HBox>
}

export function TextareaPropEditor({buffer, prop, onChange}) {
    return <VBox>
        <label>{prop}</label>
        <textarea value={propAsString(buffer, prop)} onChange={(ev) => {
            buffer.props[prop] = ev.target.value
            onChange(buffer, prop)
        }}/>
    </VBox>
}