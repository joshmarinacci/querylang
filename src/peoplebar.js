import {filter, find_in_collection, propAsString, query} from './db.js'
import {CATEGORIES} from './schema.js'
import {Window} from './ui.js'
import React from 'react'

export function PeopleBar({data}) {
    // set = DATA where type === COLLECTION and name === 'peoplebar'
    // items = DATA where id in set
    let items = query(data, {category: CATEGORIES.GENERAL, type: CATEGORIES.GENERAL.TYPES.COLLECTION})
    let collection = filter(items, {name: 'peoplebar'})[0]
    items = find_in_collection(collection, data)
    return <Window width={100} height={300} y={0} x={0} title={'people'} className={"peoplebar"}>
        <ul className={'list'}>{items.map(o => {
            return <li key={o.id}>{propAsString(o, 'first')}
                <img src={o.props.icon} alt={'user-icon'}/>
            </li>
        })}</ul>
    </Window>
}