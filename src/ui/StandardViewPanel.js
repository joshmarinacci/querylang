import React from 'react'
import "./datatable.css"
import {hasProp, propAsString, sort} from '../db.js'
import {ARRAY, BOOLEAN, CATEGORIES, SORTS, STRING} from '../schema.js'
import "./StandardViewPanel.css"
import Icon from '@material-ui/core/Icon'

function find_object_schema(object) {
    let cat = CATEGORIES[object.category]
    let sch = cat.SCHEMAS[object.type]
    return sch
}

function  find_array_contents_schema(object, name) {
    let cat = CATEGORIES[object.category]
    let sch = cat.SCHEMAS[object.type]
    // console.log("object schema is",sch, 'name is', name)
    let prop = sch.props[name]
    let content = prop.content
    // console.log("content is",content)
    let subsc = cat.SCHEMAS[content.type]
    // console.log("subsc",subsc)
    return subsc
}

export function StandardViewPanel({object, hide=[], order=[], custom={}, dividers={}}) {
    let schema = find_object_schema(object)
    let props = Object.keys(schema.props)
        .filter(name => !(hide.indexOf(name) >= 0))
        .filter(name => !(order.indexOf(name) >= 0))
    props = order.concat(props)
    return <div className={'standard-view-panel'}>
        {
            props.map((name,i)=>{
                // console.log("SCHEMA for prop",name,schema.props[name])
                let sch = schema.props[name]
                return [
                    <LineLabel key={'name_'+name} name={name} divider={dividers[name]}/>,
                    <ViewLine key={'value_'+name} object={object} schema={sch} name={name}  hint={custom[name]}/>
                ]
            })
        }
    </div>
}

function LineLabel({name, divider}) {
    if(divider) {
        return <div className={'divider'}/>
    }
    return <label>{name}</label>
}

function ViewLine({name,object,schema,hint}) {
    let value = object.props[name]
    if(hint && hint==='checkmark' && schema.type === BOOLEAN) {
        return <Icon key={'value_'+name}>{value?'check_box_outline':'check_box_outline_blank'}</Icon>
    }
    if(hint && hint==='star' && schema.type === BOOLEAN) {
        return <Icon key={'value_'+name}>{value?'star':'star_outline'}</Icon>
    }
    if(hint && hint === 'paragraph' && schema.type === STRING) {
        return <p key={'value_'+name}>{propAsString(object,name)}</p>
    }
    let val = object.props[name]
    if(schema.type === ARRAY) {
        // console.log('name',name,'hint=',hint,'schema',schema,'value',value)
        let subtype = schema.content.type
        let subschema = find_array_contents_schema(object,name)
        // console.log("subschema is",subschema)
        return <ArrayPanel key={'value_'+name} name={name} array={value} schema={subschema} hint={hint}/>
    }
    return <b key={'value_'+name}>{propAsString(object,name)}</b>
}

function ArrayPanel({array, name, schema, hint}) {
    if(!hint || !hint.expand) {
        return <div>array</div>
    }

    let values = hint.values || []
    let elems = []
    // console.log("using hint",hint)
    array.map((object,i)=>{
        let order = hint.order || []
        // console.log("using order",order)
        let props = new Set()
        Object.keys(schema.props).forEach(id => props.add(id))

        order.forEach(ord => {
            console.log("doing ord",ord)
            if(ord.name) {
                if(hasProp(object,ord.name)) {
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
            if(ord.group) {
                let str = ord.names.map(name => propAsString(object,name)).join(" ")
                ord.names.forEach(name => props.delete(name))
                elems.push(<b>{str}</b>)
            }
        })

        Array.from(props).forEach((name,i)=>{
            let sch = schema.props[name]
            // if(labels.indexOf(name)>=0) {
            //     console.log("its a label: ", name)
            //     elems.push(<label key={'name_'+i}>{propAsString(object,name)}</label>)
            //     return
            // }
            if(values.indexOf(name)>=0) {
                console.log("doing a value")
                elems.push(<ViewLine key={'value_'+name} object={object} schema={sch} name={name}/>)
                return
            }
            elems.push(<label key={'name_' + name}>{name}</label>)
            elems.push(<ViewLine key={'value_'+name} object={object} schema={sch} name={name}/>)
        })
    })
    return elems
}

