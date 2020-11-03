import {DBContext, propAsString} from './db.js'
import {CATEGORIES} from './schema.js'
import {Window} from './ui.js'
import React, {useContext} from 'react'
import {AND} from './query2.js'
import "./peoplebar.css"
import {format} from 'date-fns'
import {utcToZonedTime} from 'date-fns-tz'

const isPropTrue = (prop) => ({ equal: {prop, value:true}})

const PersonView = ({person}) => {
    let tz = propAsString(person,'timezone')
    if(!tz) tz = "America/Los_Angeles"
    let time = utcToZonedTime(Date.now(),tz)
    return <li>
        <img src={person.props.icon} alt={'user-icon'}/>
        <b>{propAsString(person, 'first')}</b>
        <i>{format(time,'h:mm aaa')}</i>
        <i>{tz.substring(tz.indexOf("/")+1)}</i>
    </li>
}

export function PeopleBar({app}) {
    const db = useContext(DBContext)
    let items = db.QUERY(AND(
    {CATEGORY:CATEGORIES.CONTACT.ID},
        {TYPE:CATEGORIES.CONTACT.TYPES.PERSON},
        isPropTrue('favorite')
    ))

    return <Window resize={false} hide_titlebar={true} app={app}>
        <ul className={'list'}>{items.map(o => {
            return <PersonView key={o.id} person={o}/>
        })}</ul>
    </Window>
}