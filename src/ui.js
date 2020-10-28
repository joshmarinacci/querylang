import React, {useEffect, useState} from 'react'
import {propAsArray, propAsBoolean, propAsString, setProp} from './db.js'
import {getEnumPropValues} from './schema.js'
import {HiMinusCircle, HiPlusCircle} from 'react-icons/hi'
import {MdClose} from 'react-icons/md'

import "./window.css"
import Icon from '@material-ui/core/Icon'
import {flatten} from './util.js'

import {Window} from "./window.js"

export {Window}

export function HBox ({children, grow, className, style, scroll, center}) {
    const cls = { hbox:true, grow, center, scroll }
    if(className) cls[className] = true
    style = style || {}
    return <div style={style} className={flatten(cls)}>{children}</div>
}
export function VBox ({children, grow, className, style, scroll, center}) {
    const cls = { vbox:true, grow, center, scroll }
    if(className) cls[className] = true
    style = style || {}
    return <div style={style} className={flatten(cls)}>{children}</div>
}

export function Toolbar ({children, grow, className, style}) {
    const cls = { toolbar:true, grow }
    if(className) cls[className] = true
    style = style || {}
    return <div style={style} className={flatten(cls)}>{children}</div>
}
export function Spacer (){
    return <span className={'spacer'}/>
}

export function Panel({children, grow}) {
    return <div className={'panel ' + (grow?"grow":"")}>{children}</div>
}

export function DataList({data, selected, setSelected, className, style, stringify}) {
    if(!stringify) stringify = (s)=>"no stringify"
    if(!setSelected) setSelected = ()=>{}
    className = className || ""
    style = style || {}
    return <ul className={'list ' + className} style={style}>{data.map(o=> {
        return <li key={o.id}
                 onClick={()=>setSelected(o)}
                 className={selected&&o&&(selected.id===o.id)?"selected":""}
      >
            {stringify(o)}
      </li>
    })}</ul>

}

export function TextPropEditor({buffer, prop, onChange, db}) {
    return <HBox>
        <label>{prop}</label>
        <input type="text"
               value={propAsString(buffer, prop)}
               onChange={(ev) => {
                   db.setProp(buffer,prop,ev.target.value)
                   if (onChange) onChange(buffer, prop)
               }}
        />

    </HBox>
}

export function CheckboxPropEditor({buffer, prop, onChange, db}) {
    return <HBox>
        <label>{prop}</label>
        <input type="checkbox"
               checked={propAsBoolean(buffer, prop)}
               onChange={(ev) => {
                   db.setProp(buffer, prop, ev.target.checked)
                   if(onChange) onChange(buffer, prop)
               }}
        />
    </HBox>
}

export function TextareaPropEditor({buffer, prop, onChange, db}) {
    return <VBox>
        <label>{prop}</label>
        <textarea value={propAsString(buffer, prop)} onChange={(ev) => {
            db.setProp(buffer, prop, ev.target.value)
            if(onChange) onChange(buffer, prop)
        }}/>
    </VBox>
}

export function EnumPropEditor({buffer, prop, onChange, db}) {
    return <HBox>
            <select value={propAsString(buffer,prop)} onChange={(ev)=>{
                db.setProp(buffer, 'type', ev.target.value)
                if(onChange) onChange(buffer,prop)
            }}>
                {getEnumPropValues(buffer,prop).map(v=>{
                    return <option key={v} value={v}>{v}</option>
                })}
        </select>
    </HBox>
}


export function AddButton({onClick}) {
    return <button onClick={onClick} className={'no-border'}>
        <HiPlusCircle className={'add-icon'}/>
    </button>
}
export function RemoveButton  ({onClick}) {
    return <button onClick={onClick} className={'no-border'}>
        <HiMinusCircle className={'remove-icon'}/>
    </button>
}

function TagView({tag, deleteTag}) {
    return <div className={'tag-view'}>
        <label>{tag}</label>
        <Icon onClick={()=>deleteTag(tag)}>delete</Icon>
    </div>
}

export function TagsetEditor({buffer, prop, onChange}) {
    let tags = propAsArray(buffer,prop)
    let [refresh, setRefresh] = useState(false)

    const addTag = (tag) => {
        tags.push(tag)
        tags = [...new Set(tags)] // remove dupes
        setProp(buffer,prop,tags)
        setRefresh(!refresh)
        if(onChange) onChange(buffer,prop)
    }
    const removeTag = (tag) => {
        tags = tags.filter(t => t !== tag)
        setProp(buffer,prop,tags)
        setRefresh(!refresh)
        if(onChange) onChange(buffer,prop)
    }

    let [partial, setPartial] = useState("")
    return <div className={'tagset-editor'}>
        <label>{prop}</label>
        {tags.map((t)=><TagView key={t} tag={t} deleteTag={removeTag}/>)}
        <input type="text"
               value={partial}
               onChange={(ev) => {
                   setPartial(ev.target.value)
               }}
               onKeyDown={(e)=>{
                   console.log(e.key)
                   if(e.key === 'Enter') {
                       addTag(partial)
                       setPartial("")
                   }
               }}
        />
    </div>
}