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
    console.log(hint,schema)
    let value = object.props[name]
    if(hint && hint==='checkmark' && schema.type === BOOLEAN) {
        console.log("doing a checkmark")
        return <Icon key={'value_'+name}>{value?'check_box_outline':'check_box_outline_blank'}</Icon>
    }
    if(hint && hint === 'paragraph' && schema.type === STRING) {
        return <p key={'value_'+name}>{propAsString(object,name)}</p>
    }
    return <b key={'value_'+name}>{propAsString(object,name)}</b>
}

