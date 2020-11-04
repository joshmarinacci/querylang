import React, {useContext, useState} from 'react'
import {attach, DBContext, propAsString, setProp, sort} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {DataList, HBox, StandardListItem, VBox, Window} from '../ui.js'
import {AND} from '../query2.js'
import "./chat.css"

const isConversation = () => ({ TYPE:CATEGORIES.CHAT.TYPES.CONVERSATION })
const isMessage = () => ({ TYPE:CATEGORIES.CHAT.TYPES.MESSAGE })
const isChatCategory = () => ({ CATEGORY:CATEGORIES.CHAT.ID })
const isPropEqual = (prop,value) => ({ equal: {prop, value}})
const isPerson = () => ({ TYPE:CATEGORIES.CONTACT.TYPES.PERSON })
const isContactCategory = () => ({ CATEGORY:CATEGORIES.CONTACT.ID })

export function Chat({app}) {
    const [selected, setSelected] = useState(null)
    const [text, setText] = useState("")
    let db = useContext(DBContext)
    let conversations = db.QUERY(AND(isChatCategory(),isConversation()))

    let messages = []

    if (selected) {
        messages = db.QUERY(AND(
            isChatCategory(),
            isMessage(),
            isPropEqual('receivers',selected.props.people)))
    }

    let people = db.QUERY(isContactCategory(), isPerson())
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
                data={conversations}
                selected={selected}
                setSelected={setSelected}
                stringify={(o) => <StandardListItem title={propAsString(o, 'title')} icon={'chat'}/>}
            />
            <VBox grow>
                <DataList style={{flex:1}} data={messages} className={'thread'} stringify={(o) => {
                    return <div className={(o.props.sender.id===1?"self":"")}>
                        <b>{propAsString(o, 'timestamp')}</b>
                        <i>{propAsString(o.props.sender, 'first')}</i>
                        <p>{propAsString(o, 'contents')}</p>
                    </div>
                }}/>
                <input type={'text'} value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={e=>{
                    if(e.key === 'Enter')
                        sendText()
                    }
                }/>
            </VBox>
        </HBox>
    </Window>
}