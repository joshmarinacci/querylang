import React, {useState} from 'react'
import {DataList, HBox, Panel, Spacer, Toolbar, VBox, Window} from './ui.js'
import {CATEGORIES} from './schema.js'
import {propAsString, useDBChanged} from './db.js'
import {AND} from './query2.js'
import {format} from "date-fns"

const isMessage = () => ({ TYPE:CATEGORIES.EMAIL.TYPES.MESSAGE })
const isTask = () => ({ TYPE:CATEGORIES.TASKS.TYPES.TASK })
const isEmailCategory = () => ({ CATEGORY:CATEGORIES.EMAIL.ID })
const isPropTrue = (prop) => ({ equal: {prop, value:true}})
const isPropFalse = (prop) => ({ equal: {prop, value:false}})
const isPropEqual = (prop,value) => ({ equal: {prop, value}})
const isPropEqualId = (prop,obj) => ({ equal: {prop, value:obj?obj.id:null}})
const isPropSubstring = (prop,value) => ({ substring: {prop, value}})

export function Email({db, app, appService}) {
    useDBChanged(db,CATEGORIES.EMAIL.ID)

    const [selected, setSelected] = useState(null)

    let messages = db.QUERY(AND(isMessage(), isEmailCategory()))

    let panel = <div>no message selected</div>
    if(selected) {
        panel = <div style={{
            width:'100%',
            whiteSpace:"pre-line",
            padding:'1em',
        }}>{propAsString(selected,'body')}</div>
    }

    return <Window  app={app} appService={appService} resize width={600} height={400}>
        <VBox grow>
            <Toolbar>
                <button>new</button>
                <button>delete</button>
                <button>inbox</button>
                <input type="search"/>
            </Toolbar>
            <HBox grow>

                <DataList data={messages}
                          selected={selected}
                          setSelected={setSelected}
                          stringify={o => {
                    return <VBox grow>
                        <HBox grow>
                            <b>{propAsString(o,'sender')}</b>
                            <Spacer/>
                            <i>{format(propAsString(o,'timestamp')," E MMM d")}</i>
                        </HBox>
                        <label>{propAsString(o,'subject')}</label>
                    </VBox>
                }}/>
                <Panel grow>{panel}</Panel>
            </HBox>
            </VBox>
    </Window>
}
