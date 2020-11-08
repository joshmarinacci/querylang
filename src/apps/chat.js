import React, {useContext, useState} from 'react'
import {attach, DBContext, propAsString, setProp, sort} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {DataList, HBox, StandardListItem, Toolbar, VBox, Window} from '../ui/ui.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../query2.js'
import {format, isWithinInterval, setHours, getHours, setMinutes, getMinutes, isAfter,
    subDays, addDays,
    startOfDay, endOfDay,
} from 'date-fns'

import "./chat.css"

export function Chat({app}) {
    const [selected, setSelected] = useState(null)
    const [text, setText] = useState("")
    let db = useContext(DBContext)
    let conversations = db.QUERY(AND(IS_CATEGORY(CATEGORIES.CHAT.ID),IS_TYPE(CATEGORIES.CHAT.TYPES.CONVERSATION)))

    let messages = []

    if (selected) {
        messages = db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.CHAT.ID),
            IS_TYPE(CATEGORIES.CHAT.TYPES.MESSAGE),
            IS_PROP_EQUAL("receivers",selected.props.people)))
    }

    let people = db.QUERY(AND(IS_CATEGORY(CATEGORIES.CONTACT.ID), IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON)))
    messages = attach(messages, people, 'sender', 'id')
    messages = sort(messages, ['timestamp'])

    // conversations = attach_in(conversations,people,'people','id')
    const sendText = () => {
        let msg = db.make(CATEGORIES.CHAT.ID,CATEGORIES.CHAT.TYPES.MESSAGE)
        setProp(msg,'sender',1)
        setProp(msg,'receivers',selected.props.people.slice())
        setProp(msg,'contents',text)
        setProp(msg,'timestamp',Date.now())
        setText("")
        db.add(msg)


        let alert = db.make(CATEGORIES.NOTIFICATION.ID, CATEGORIES.NOTIFICATION.TYPES.ALERT)
        setProp(alert,'title','sent a message')
        db.add(alert)
    }

    return <Window app={app}>
        <HBox grow>
            <DataList
                className={'sidebar'}
                data={conversations}
                selected={selected}
                setSelected={setSelected}
                stringify={(o) => <StandardListItem title={propAsString(o, 'title')} icon={'chat'}/>}
            />
            <VBox grow className={'content-panel'}>
                <VBox grow scroll>
                <DataList style={{flex:1}} data={messages} className={'thread'} stringify={(o) => {
                    return <VBox className={(o.props.sender.id===1?"self":"")}>
                        <HBox>
                            <img src={propAsString(o.props.sender,'icon')} alt={'user-icon'}/>
                            <i>{propAsString(o.props.sender, 'first')}</i>
                            <b>{format(o.props.timestamp,'hh:mm:ss')}</b>
                        </HBox>
                        <em>{propAsString(o, 'contents')}</em>
                    </VBox>
                }}/>

                </VBox>
                <Toolbar className={'bottom'}>
                    <input style={{
                        flex:'1.0',
                    }} type={'text'} value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={e=>{
                        if(e.key === 'Enter')
                            sendText()
                        }
                    }/>
                    <button>send</button>
                </Toolbar>
            </VBox>
        </HBox>
    </Window>
}