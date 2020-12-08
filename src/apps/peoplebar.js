import {DBContext, propAsString} from '../db.js'
import {CATEGORIES} from '../schema.js'
import React, {useContext, useEffect, useState} from 'react'
import {AND, IS_CATEGORY, IS_PROP_TRUE, IS_TYPE} from '../query2.js'
import "./peoplebar.css"
import {format} from 'date-fns'
import {utcToZonedTime} from 'date-fns-tz'
import {EXECUTE, EXPAND, IS_DOMAIN, JOIN, JOIN_SOURCE, ON_EQUAL} from '../query3.js'


const PersonView = ({person}) => {
    let tz = propAsString(person,'timezone')
    let time = utcToZonedTime(Date.now(),tz)
    return <li>
        <img src={person.props.icon} alt={'user-icon'}/>
        <b>{propAsString(person, 'first')}</b>
        <i>{format(time,'h:mm aaa')}</i>
        <i>{person.props.timezone}</i>
    </li>
}

function useQuery(q) {
    const db = useContext(DBContext)
    const [items, set_items] = useState([])
    // useDBChanged(db,CATEGORIES.CONTACT.ID)
    useEffect(()=>{
        console.log("executing the query")
        EXECUTE(db,q).then(res => {
            console.log("got better result",res)
            set_items(res)
        })
    },[])
    return items
}

export function PeopleBar({app}) {
    //grab favorite contacts
    let favorites = AND(
        IS_DOMAIN('local'),
        IS_CATEGORY(CATEGORIES.CONTACT.ID),
        IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON),
        IS_PROP_TRUE("favorite")
    )
    //expand addresses in case there are two
    let expanded_addresses = EXPAND(favorites,"addresses")
    // join with timezones from city info
    let dynamic_timezones = JOIN(
        expanded_addresses,
        JOIN_SOURCE(
            IS_DOMAIN("cityinfo"),
            ON_EQUAL(['addresses','city'],'city'),
            ON_EQUAL(['addresses','state'],'state'),
        )
    )

    // fetch the items
    const items = useQuery(dynamic_timezones)

    return <ul>{items.map(o => <PersonView key={o.id} person={o}/>)}</ul>
}