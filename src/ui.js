import React from 'react'
import {propAsBoolean, propAsString, setProp} from './db.js'
import {getEnumPropValues} from './schema.js'
import {HiMinusCircle, HiPlusCircle} from 'react-icons/hi'


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
export function TagsetEditor({buffer, prop, onChange, onBlur}) {
    return <HBox>
        <label>{prop}</label>
        <input type="text"
               value={propAsString(buffer, prop)}
               onBlur={onBlur}
               onChange={(ev) => {
                   console.log("ev.target.value",ev.target.value)
                   setProp(buffer,prop,ev.target.value)
                   onChange(buffer, prop)
               }}
        />
    </HBox>
}