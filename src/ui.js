import React, {useState} from 'react'
import {propAsArray, propAsBoolean, propAsString, setProp} from './db.js'
import {getEnumPropValues} from './schema.js'
import {HiMinusCircle, HiPlusCircle} from 'react-icons/hi'
import {MdClose} from 'react-icons/md'


export function HBox ({children, grow}) {
    return <div className={'hbox ' + (grow?"grow":"")}>{children}</div>
}
export function VBox ({children, grow, className, style}) {
    className = className?className:""
    style = style || {}
    return <div style={style} className={'vbox ' + (grow?"grow":"") + " " + className}>{children}</div>
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
export function Window({x,y,width,height,children,title, className}) {
    let style = {
        width: width ? (width + "px") : "100px",
        height: height ? (height + "px") : "100px",
        position:'absolute',
        left:x?(x+'px'):'0px',
        top:y?(y+'px'):'0px',
    }
    if(!className) className = ""
    return <div className={"window " + className} style={style}>
        <title>{title}</title>
        {children}</div>
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

export function TextPropEditor({buffer, prop, onChange}) {
    return <HBox>
        <label>{prop}</label>
        <input type="text"
               value={propAsString(buffer, prop)}
               onChange={(ev) => {
                   setProp(buffer,prop,ev.target.value)
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
                   setProp(buffer,prop,ev.target.checked)
                   onChange(buffer, prop)
               }}
        />
    </HBox>
}

export function TextareaPropEditor({buffer, prop, onChange}) {
    return <VBox>
        <label>{prop}</label>
        <textarea value={propAsString(buffer, prop)} onChange={(ev) => {
            setProp(buffer,prop,ev.target.value)
            onChange(buffer, prop)
        }}/>
    </VBox>
}

export function EnumPropEditor({buffer, prop, onChange}) {
    return <HBox>
            <select value={propAsString(buffer,prop)} onChange={(ev)=>{
                setProp(buffer,'type',ev.target.value)
                onChange(buffer,prop)
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
        tags = [... new Set(tags)] // remove dupes
        setProp(buffer,prop,tags)
        setRefresh(!refresh)
        onChange(buffer,prop)
    }
    const removeTag = (tag) => {
        tags = tags.filter(t => t !== tag)
        setProp(buffer,prop,tags)
        setRefresh(!refresh)
        onChange(buffer,prop)
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