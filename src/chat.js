import React, {useState} from 'react'
import {attach, propAsString, setProp, sort} from './db.js'
import {CATEGORIES} from './schema.js'
import {DataList, HBox, VBox, Window} from './ui.js'
import {AND, query2 as QUERY} from './query2.js'

const isConversation = () => ({ TYPE:CATEGORIES.CHAT.TYPES.CONVERSATION })
const isMessage = () => ({ TYPE:CATEGORIES.CHAT.TYPES.MESSAGE })
const isChatCategory = () => ({ CATEGORY:CATEGORIES.CHAT.ID })
const isPropEqual = (prop,value) => ({ equal: {prop, value}})
const isPerson = () => ({ TYPE:CATEGORIES.CONTACT.TYPES.PERSON })
const isContactCategory = () => ({ CATEGORY:CATEGORIES.CONTACT.ID })

export function Chat({db}) {
    const [selected, setSelected] = useState(null)
    const [text, setText] = useState("")
    let conversations = db.QUERY(AND(isChatCategory(),isConversation()))
    const [refresh, setRefresh] = useState(false)
    const doRefresh = () => setRefresh(!refresh)


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
        doRefresh()
    }

    return <Window width={500} height={320} x={650} y={0} title={'chat'} className={"chat"}>
        <HBox grow>
            <DataList
                data={conversations}
                selected={selected}
                setSelected={setSelected}
                stringify={(o) => propAsString(o, 'title')}
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