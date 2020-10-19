import {find_in_collection, propAsString} from './db.js'
import {CATEGORIES} from './schema.js'
import {Window} from './ui.js'
import React from 'react'
import {AND, query2 as QUERY} from './query2.js'
import {MdWbSunny} from 'react-icons/all.js'
import "./peoplebar.css"

const isGeneralCategory = () => ({ CATEGORY:CATEGORIES.GENERAL.ID })
const isCollection = () => ({ TYPE:CATEGORIES.GENERAL.TYPES.COLLECTION })
const isPropEqual = (prop,value) => ({ equal: {prop, value}})

const PersonView = ({person}) => {
    return <li>
        <img src={person.props.icon} alt={'user-icon'}/>
        <b>{propAsString(person, 'first')}</b>
        <i>8am <MdWbSunny/></i>
    </li>
}

export function PeopleBar({db, app, appService}) {
    let items = db.QUERY(AND(isGeneralCategory(), isCollection()))
    let collection = QUERY(items, AND(isPropEqual('name','peoplebar')))[0]
    items = find_in_collection(collection, db.data)
    return <Window width={100} height={326} y={0} x={300} title={'people'} className={"peoplebar"} resize={false} hide_titlebar={true} app={app} appService={appService}>
        <ul className={'list'}>{items.map(o => {
            return <PersonView key={o.id} person={o}/>
        })}</ul>
    </Window>
}