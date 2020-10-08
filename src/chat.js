import React, {useState} from 'react'
import {attach, filter, propAsString, query, sort} from './db.js'
import {CATEGORIES} from './schema.js'
import {DataList, HBox, Window} from './ui.js'

export function Chat({data}) {
    const [selected, setSelected] = useState(null)
    let conversations = query(data, {category: CATEGORIES.CHAT, type: CATEGORIES.CHAT.TYPES.CONVERSATION})

    let messages = []

    if (selected) {
        messages = query(data, {category: CATEGORIES.CHAT, type: CATEGORIES.CHAT.TYPES.MESSAGE})
        messages = filter(messages, {receivers: selected.props.people})
    }

    let people = query(data, {category: CATEGORIES.CONTACT, type: CATEGORIES.CONTACT.TYPES.PERSON})
    messages = attach(messages, people, 'sender', 'id')
    messages = sort(messages, ['timestamp'])

    // conversations = attach_in(conversations,people,'people','id')

    return <Window width={500} height={320} x={650} y={0} title={'chat'} className={"chat"}>
        <HBox>
            <DataList
                data={conversations}
                selected={selected}
                setSelected={setSelected}
                stringify={(o) => propAsString(o, 'title')}
            />
            <DataList style={{flex:1}} data={messages} className={'thread'} stringify={(o) => {
                return <div className={(o.props.sender.id===1?"self":"")}>
                    <b>{propAsString(o, 'timestamp')}</b>
                    <i>{propAsString(o.props.sender, 'first')}</i>
                    <p>{propAsString(o, 'contents')}</p>
                </div>
            }}/>
        </HBox>
    </Window>
}