import React from 'react'
import "./datatable.css"
import {hasProp, propAsString, sort} from '../db.js'
import {BOOLEAN, CATEGORIES, SORTS, STRING} from '../schema.js'
import "./StandardViewPanel.css"
import Icon from '@material-ui/core/Icon'

function find_object_schema(object) {
    let cat = CATEGORIES[object.category]
    let sch = cat.SCHEMAS[object.type]
    return sch
}

export function StandardViewPanel({object, hide=[], order=[], custom={}}) {
    let schema = find_object_schema(object)
    let props = Object.keys(schema.props)
        .filter(name => !(hide.indexOf(name) >= 0))
        .filter(name => !(order.indexOf(name) >= 0))
    props = order.concat(props)
    return <div className={'standard-view-panel'}>
        {
            props.map((name,i)=>{
                console.log("SCHEMA for prop",name,schema.props[name])
                let sch = schema.props[name]
                return [
                    <label key={'name_'+name}>{name}</label>,
                    <ViewLine key={'value_'+name} object={object} schema={sch} name={name}
                              hint={custom[name]}
                    />
                    ]
            })
        }
    </div>
}

function ViewLine({name,object,schema,hint}) {
    let value = object.props[name]
    console.log('name',name,'hint=',hint,'schema',schema,'value',value)
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
    if(Array.isArray(val)) {
        return <b key={'value_'+name}>an array</b>
    }
    return <b key={'value_'+name}>{propAsString(object,name)}</b>
}

