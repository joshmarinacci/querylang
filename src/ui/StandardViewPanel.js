import React from 'react'
import "./datatable.css"
import {hasProp, propAsString} from '../db.js'
import {ARRAY, BOOLEAN, CATEGORIES, STRING} from '../schema.js'
import "./StandardViewPanel.css"
import Icon from '@material-ui/core/Icon'

export function find_object_schema(object, customSchema) {
    if(customSchema) return customSchema.SCHEMAS[object.type]
    let cat = CATEGORIES[object.category]
    let sch = cat.SCHEMAS[object.type]
    return sch
}

export function find_array_contents_schema(object, name) {
    let cat = CATEGORIES[object.category]
    let sch = cat.SCHEMAS[object.type]
    let prop = sch.props[name]
    let content = prop.content
    let subsc = cat.SCHEMAS[content.type]
    subsc.category = object.category
    subsc.type = content.type
    return subsc
}

export function StandardViewPanel({object, hide = [], order = [], custom = {}}) {
    let schema = find_object_schema(object)
    let elems = []
    let props = new Set()
    Object.keys(schema.props).forEach(id => props.add(id))
    hide.forEach(name => props.delete(name))
    order.forEach(ord =>{
        if(typeof ord === 'string') {
            let name = ord
            let sch = schema.props[name]
            elems.push(<LineLabel key={'name_' + name} name={name} object={object} hint={custom[name]} schema={sch}/>)
            elems.push(<ViewLine key={'value_' + name} object={object} schema={sch} name={name} hint={custom[name]}/>)
            props.delete(ord)
            return
        }
        if(typeof ord === 'object') {
            if(ord.group) {
                let str = ord.names.map(name => propAsString(object, name)).join(" ")
                elems.push(<b>{str}</b>)
                ord.names.forEach(name => props.delete(name))
            }
            return
        }
    })

    props.forEach((name, i) => {
        let sch = schema.props[name]
        elems.push(<LineLabel key={'name_' + name} name={name} object={object} hint={custom[name]} schema={sch}/>)
        elems.push(<ViewLine key={'value_' + name} object={object} schema={sch} name={name} hint={custom[name]}/>)
    })

    return <div className={'standard-view-panel'}>{elems}</div>
}

function shouldHide(hint, schema, object, name) {
    if(!hint) return
    if(hint.hide) {
        return true
    }
    if(hint.hide_empty) {
        if(schema.type === ARRAY) {
            let val = object.props[name]
            if(val.length === 0) return true
        }
        if(schema.type === STRING) {
            if(!(name in object.props)) return true
            let val = object.props[name]
            if(val === undefined) return true
            if(val === "") return true
        }
    }
    return false
}

function LineLabel({name, divider, object, hint, schema}) {
    if(shouldHide(hint,schema,object,name)) return ""
    if (hint && hint.divider === true) return <div className={'divider'}/>
    return <label>{name}</label>
}

function ViewLine({name, object, schema, hint}) {
    let value = object.props[name]
    if(shouldHide(hint,schema,object,name)) return ""

    if (hint && hint === 'checkmark' && schema.type === BOOLEAN) {
        return <Icon key={'value_' + name}>{value ? 'check_box_outline' : 'check_box_outline_blank'}</Icon>
    }
    if (hint && hint === 'star' && schema.type === BOOLEAN) {
        return <Icon key={'value_' + name}>{value ? 'star' : 'star_outline'}</Icon>
    }
    if (hint && hint === 'paragraph' && schema.type === STRING) {
        return <p key={'value_' + name}>{propAsString(object, name)}</p>
    }
    let val = object.props[name]
    if (schema.type === ARRAY) {
        let subtype = schema.content.type
        if (subtype === STRING) return <b key={'value_' + name}>{val.join(", ")}</b>
        let subschema = find_array_contents_schema(object, name)
        return <ArrayPanel key={'value_' + name} name={name} array={value} schema={subschema} hint={hint}/>
    }
    return <b key={'value_' + name}>{propAsString(object, name)}</b>
}

function ArrayPanel({array, name, schema, hint}) {
    if (!hint || !hint.expand) {
        return <div>array</div>
    }

    let values = hint.values || []
    let elems = []
    array.map((object, i) => {
        let order = hint.order || []
        let props = new Set()
        Object.keys(schema.props).forEach(id => props.add(id))
        order.forEach(ord => {
            if (ord.name) {
                if (hasProp(object, ord.name)) {
                    if (ord.value_label === true) {
                        elems.push(<label key={'name_' + i}>{propAsString(object, ord.name)}</label>)
                    } else {
                        let sch = schema.props[ord.name]
                        elems.push(<ViewLine key={'value_' + name + '_' + ord.name} object={object} schema={sch}
                                             name={ord.name}/>)
                    }
                }
                props.delete(ord.name)
            }
            if (ord.group) {
                let str = ord.names.map(name => propAsString(object, name)).join(" ")
                ord.names.forEach(name => props.delete(name))
                elems.push(<b>{str}</b>)
            }
        })

        Array.from(props).forEach((name, i) => {
            let sch = schema.props[name]
            if (values.indexOf(name) >= 0) {
                elems.push(<ViewLine key={'value_' + name} object={object} schema={sch} name={name}/>)
                return
            }
            elems.push(<label key={'name_' + name}>{name}</label>)
            elems.push(<ViewLine key={'value_' + name} object={object} schema={sch} name={name}/>)
        })
    })
    return elems
}

