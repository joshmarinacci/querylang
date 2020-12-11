import React, {useContext, useRef, useState} from 'react'
import {DBContext, propAsArray, propAsBoolean, propAsString, setProp} from '../db.js'
import {getEnumPropValues} from '../schema.js'

// import "./window.css"
import "./ui.css"
import "./menus.css"
import Icon from '@material-ui/core/Icon'
import {flatten} from '../util.js'

import {Window} from "./window.js"
import {PopupManagerContext} from './PopupManager.js'

export {Window}

export function HBox ({children, grow, className, style, scroll, center, ...rest}) {
    const cls = { hbox:true, grow, center, scroll }
    if(className) cls[className] = true
    style = style || {}
    return <div style={style} className={flatten(cls)} {...rest}>{children}</div>
}
export function Group({className, ...rest}) {
    return <HBox className={'group ' + className} {...rest}/>
}
export function InfoBar({className, title, ...rest}) {
    return <div className={'infobar ' + className} {...rest}>{title}</div>
}

export function FormGroup({className, ...rest}) {
    return <div className={"form-grid " + className} {...rest}/>
}
export function VBox ({children, grow, className, style, scroll, center}) {
    const cls = { vbox:true, grow, center, scroll }
    if(className) cls[className] = true
    style = style || {}
    return <div style={style} className={flatten(cls)}>{children}</div>
}
export function Spacer (){
    return <span className={'spacer'}/>
}

export function Toolbar ({children, grow, className, style}) {
    const cls = { toolbar:true, grow }
    if(className) cls[className] = true
    style = style || {}
    return <div style={style} className={flatten(cls)}>{children}</div>
}

export function Panel({children, grow, className, style}) {
    const cls = { panel:true, grow }
    if(className) cls[className] = true
    style = style || {}
    return <div className={flatten(cls)}>{children}</div>
}

export function TextPropEditor({buffer, prop, onChange, ...rest}) {
    let db = useContext(DBContext)
    return <HBox className={'textprop-editor'} {...rest}>
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

export function EnumPropEditor({buffer, prop, onChange, db}) {
    return <HBox>
            <select value={propAsString(buffer,prop)} onChange={(ev)=>{
                db.setProp(buffer, prop, ev.target.value)
                if(onChange) onChange(buffer,prop)
            }}>
                {getEnumPropValues(buffer,prop).map(v=>{
                    return <option key={v} value={v}>{v}</option>
                })}
        </select>
    </HBox>
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
        {/*<label>{prop}</label>*/}
        {tags.map((t)=><TagView key={t} tag={t} deleteTag={removeTag}/>)}
        <input type="text"
               value={partial}
               onChange={(ev) => {
                   setPartial(ev.target.value)
               }}
               onKeyDown={(e)=>{
                   if(e.key === 'Enter') {
                       addTag(partial)
                       setPartial("")
                   }
               }}
        />
    </div>
}



export function ActionButton({caption, ...rest}) {
    return <button {...rest}>{caption}</button>
}
export function ToggleButton({caption, selected, icon, ...rest}) {
    let cls = {
        selected:selected
    }
    return <button className={flatten(cls)} {...rest}>{icon?<Icon>{icon}</Icon>:""} {caption}</button>
}
export function ToggleGroup({children, className, ...rest}) {
    return <div className={'toggle-group ' + (className?className:"")} {...rest}>{children}</div>
}

export function PopupTriggerButton({makePopup, title}) {
    const popupButton = useRef()
    let pm = useContext(PopupManagerContext)

    const showSortPopup = () => {
        if(makePopup) return pm.show(makePopup(), popupButton.current)
        console.warn("makePopup is null in PopupTriggerButton")
    }
    return <button onClick={showSortPopup} ref={popupButton}
                   className={'popup-trigger-button'}
    >
        {title}
        <Icon>arrow_drop_down</Icon>
    </button>
}

export function MenuBar({children}) {
    return <ul className={'menu-bar'}>{children}</ul>
}
export function MenuBarButton({caption,children, icon, ...rest}) {
    return <li>
        <div className={'item'} {...rest}>
            {caption?<button className={'menu-button'}>{caption}</button>:""}
            {icon?<Icon>{icon}</Icon>:""}
        </div>
        {children}
    </li>
}
export function MenuContainer({children, style={}}) {
    return <ul className={'menu-container'} style={style}>{children}</ul>
}
export function MenuItem({caption}) {
    return <li>
        <div className={'item'}>
            <button>{caption}</button>
        </div>
    </li>
}
export function MenuDivider({}) {
    return <li className={'divider'}/>
}
export function MenuHeader({caption}) {
    return <li className={'header'}>{caption}</li>
}
export function MenuItemTriggerSub({caption, children}) {
    return <li>
        <div className={'item'}>
            <button className={'menu-button'}>{caption}</button>
            <Spacer/>
            <Icon>arrow_right</Icon>
        </div>
        {children}
    </li>
}