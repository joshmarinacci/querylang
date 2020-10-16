import {find_in_collection, propAsString} from './db.js'
import {CATEGORIES} from './schema.js'
import {Window} from './ui.js'
import React from 'react'
import {AND, query2 as QUERY} from './query2.js'

const isGeneralCategory = () => ({ CATEGORY:CATEGORIES.GENERAL.ID })
const isCollection = () => ({ TYPE:CATEGORIES.GENERAL.TYPES.COLLECTION })
const isPropEqual = (prop,value) => ({ equal: {prop, value}})


export function PeopleBar({db}) {
    let items = db.QUERY(AND(isGeneralCategory(), isCollection()))
    let collection = QUERY(items, AND(isPropEqual('name','peoplebar')))[0]
    items = find_in_collection(collection, db.data)
    return <Window width={100} height={300} y={0} x={0} title={'people'} className={"peoplebar"}>
        <ul className={'list'}>{items.map(o => {
            return <li key={o.id}>{propAsString(o, 'first')}
                <img src={o.props.icon} alt={'user-icon'}/>
            </li>
        })}</ul>
    </Window>
}