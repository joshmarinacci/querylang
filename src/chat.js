import React, {useState} from 'react'
import {attach, filter, propAsString, query, setProp, sort} from './db.js'
import {CATEGORIES, makeNewObject} from './schema.js'
import {DataList, HBox, VBox, Window} from './ui.js'

export function Chat({data}) {
    const [selected, setSelected] = useState(null)
    const [text, setText] = useState("")
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
    const sendText = () => {
        let msg = makeNewObject(CATEGORIES.CHAT.TYPES.MESSAGE)
        setProp(msg,'sender',1)
        setProp(msg,'receivers',selected.props.people.slice())
        setProp(msg,'contents',text)
        setProp(msg,'timestamp',Date.now())
        console.log("made a message",msg, selected.props.people)
        setText("")
        data.push(msg)
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