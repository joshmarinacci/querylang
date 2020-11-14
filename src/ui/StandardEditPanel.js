import React, {useContext} from 'react'
import "./datatable.css"
import {DBContext, hasProp, propAsBoolean, propAsString, useDBChanged} from '../db.js'
import {ARRAY, BOOLEAN, CATEGORIES, ENUM, getEnumPropValues, STRING} from '../schema.js'
import "./StandardEditPanel.css"
import Icon from '@material-ui/core/Icon'
import {find_array_contents_schema, find_object_schema} from './StandardViewPanel.js'
import {AddButton, CheckboxPropEditor, EnumPropEditor, HBox, RemoveButton, TextPropEditor, VBox} from './ui.js'


export function StandardEditPanel({object, hide=[], order=[], custom=[]}) {
    let schema = find_object_schema(object)
    let props = new Set()
    Object.keys(schema.props).forEach(id => props.add(id))
    hide.forEach(name => props.delete(name))

    let elems = []
    props.forEach((name, i) => {
        let sch = schema.props[name]
        elems.push(<PropLabel prop={name}/>)
        elems.push(<PropEditor object={object} prop={name} propSchema={sch} objectSchema={schema}/>)
    })

    const dumpObject = () => {
        console.log("object is now",object)
    }

    elems.push(<button onClick={dumpObject}>check</button>)
    return <div className={'standard-edit-panel'}>{elems}</div>
}

function PropLabel({prop}) {
    return <label key={`label_${prop}`}>{prop}</label>
}

function PropEditor({object,prop, propSchema, objectSchema}) {
    if(propSchema.type === STRING) {
        return <PropStringEditor key={'editor_'+prop} prop={prop} object={object} propSchema={propSchema} objectSchema={objectSchema}/>
    }
    if(propSchema.type === BOOLEAN) {
        return <PropBooleanEditor key={'editor_'+prop} prop={prop} object={object}/>
    }
    if(propSchema.type === ARRAY) {
        return <PropArrayEditor key={'editor_'+prop} prop={prop} object={object}/>
    }
    if(propSchema.type === ENUM) {
        return <PropEnumEditor key={'editor_'+prop} prop={prop} object={object}
                               propSchema={propSchema} objectSchema={objectSchema}/>
    }
    return <div>no editor for {prop} of type {propSchema.type}</div>
}

function PropStringEditor({object, prop}) {
    let db = useContext(DBContext)
    return <input type='text' value={propAsString(object,prop)} onChange={(ev)=>{
        db.setProp(object,prop,ev.target.value)
    }}/>
}

function PropEnumEditor({object,prop}) {
    let db = useContext(DBContext)
    return <select value={propAsString(object,prop)} onChange={ev => {
        db.setProp(object,prop,ev.target.value)
    }}>
        {getEnumPropValues(object,prop).map(v => {
            return <option key={v} value={v}>{v}</option>
        })}
    </select>
}

function PropBooleanEditor({object,prop}) {
    let db = useContext(DBContext)
    return <input type={'checkbox'} checked={propAsBoolean(object,prop)}
                  onChange={(ev)=>{
                      db.setProp(object,prop,ev.target.checked)
                  }}
    />
}

function PropArrayEditor({prop, object}) {
    let db = useContext(DBContext)

    let values = object.props[prop]
    let sc = find_array_contents_schema(object,prop)
    const addObject = () => {
        let obj = db.make(sc.category, sc.type)
        object.props[prop].push(obj)
        db.setProp(object,prop,object.props[prop])
    }
    const removeObject = (o) => {
        object.props[prop] = object.props[prop].filter(t => o!==t)
        db.setProp(object,prop,object.props[prop])
    }
    return <ul className={'array-editor'}>
        {values.map((v,i)=>{
            return  [
                <ObjectEditor object={v} schema={sc}/>,
                <button className={'remove-button'} onClick={()=>removeObject(v)}>rem</button>
            ]
        })}
        <li><button className={'add-button'} onClick={addObject}>add</button></li>
    </ul>
}
function ObjectEditor({object, schema}) {
    let props = new Set()
    Object.keys(schema.props).forEach(id => props.add(id))
    let elems = []
    props.forEach((name, i) => {
        let sch = schema.props[name]
        elems.push(<PropLabel prop={name}/>)
        elems.push(<PropEditor object={object} prop={name} propSchema={sch} objectSchema={schema}/>)
    })
    return <div className={'standard-edit-panel'}>{elems}</div>
}