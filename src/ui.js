import React, {useEffect, useState} from 'react'
import {propAsArray, propAsBoolean, propAsString, setProp} from './db.js'
import {getEnumPropValues} from './schema.js'
import {HiMinusCircle, HiPlusCircle} from 'react-icons/hi'
import {MdClose} from 'react-icons/md'

import "./window.css"


export function HBox ({children, grow}) {
    return <div className={'hbox ' + (grow?"grow":"")}>{children}</div>
}
export function VBox ({children, grow, className, style, scroll}) {
    className = className?className:""
    style = style || {}
    return <div style={style} className={'vbox ' + (grow?"grow":"") + " " + (scroll?"scroll":"") +  " " + className}>{children}</div>
}

export function Toolbar ({children, grow, className, style}) {
    className = className?className:""
    style = style || {}
    return <div style={style} className={'toolbar ' + (grow?"grow":"") + " " + className}>{children}</div>
}
export function Spacer (){
    return <span className={'spacer'}/>
}

export function Panel({children, grow}) {
    return <div className={'panel ' + (grow?"grow":"")}>{children}</div>
}
export function Window({width,height,children,title, className, resize, hide_titlebar, appService, app, anchor="none"}) {

    let [dragging, setDragging] = useState(false)
    let [left,setLeft] = useState((title=="apps")?0:100)
    let [top,setTop] = useState(0)
    let [offx, setOffx] = useState(0)
    let [offy, setOffy] = useState(0)

    let [w,sw] = useState(width?width:100)
    let [h,sh] = useState(height?height:100)

    let [resizing, setResizing] = useState(false)

    let style = {
        width: `${w}px`,
        height: `${h}px`,
        position:'absolute',
        left:`${left-offx}px`,
        top:(top-offy)+'px',
    }
    if(anchor === "top-right"){
        style.left = null
        style.right = '0px'
        style.bottom = null
        style.top = '0px'
    }
    if(!className) className = ""

    const mouseMove = (e) => {
        setLeft(e.screenX)
        setTop(e.screenY)
    }
    const mouseUp = () => {
        setLeft(left-offx)
        setOffx(0)
        setTop(top-offy)
        setOffy(0)
        setDragging(false)
    }
    useEffect(()=>{
        if(dragging) {
            window.addEventListener('mousemove',mouseMove)
            window.addEventListener('mouseup',mouseUp)
        }
        return ()=>{
            window.removeEventListener('mousemove', mouseMove)
            window.removeEventListener('mouseup',mouseUp)
        }
    })
    const mouseDown = (e) => {
        setOffx(e.screenX - left)
        setLeft(e.screenX)
        setOffy(e.screenY - top)
        setTop(e.screenY)
        setDragging(true)
    }

    const resize_mouse_down = (e) => {
        setResizing(true)
    }

    const resize_mouse_move = (e) => {
        sw(e.pageX-left)
        sh(e.pageY - top)
    }
    const resize_mouse_up = (e) => {
        setResizing(false)
    }

    useEffect(()=>{
        if(resizing) {
            window.addEventListener('mousemove',resize_mouse_move)
            window.addEventListener('mouseup',resize_mouse_up)
        }
        return ()=>{
            window.removeEventListener('mousemove', resize_mouse_move)
            window.removeEventListener('mouseup',resize_mouse_up)
        }
    })


    if(dragging) className += " dragging "
    if(resizing) className += " resizing "

    const closeApp = () => appService.close(app)

    let resize_handle = ""
    if(resize) {
        resize_handle = <label className={'resize-handle'}
               onMouseDown={resize_mouse_down}
        >XXXX</label>

    }
    let title_ui = ""
    if(!title && app && app.props && app.props.title) {
        title = app.props.title
    }
    if(!hide_titlebar) {
        title_ui = <title onMouseDown={mouseDown}>
            <b>{title}</b>
            <MdClose onClick={closeApp}/>
        </title>
    }
    return <div className={"window " + className} style={style}>
        {title_ui}
        {children}
        {resize_handle}
    </div>
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
            <MdClose onClick={()=>deleteTag(tag)}/>
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