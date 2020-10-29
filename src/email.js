import React, {useState} from 'react'
import {DataList, HBox, Panel, Spacer, Toolbar, VBox, Window} from './ui.js'
import {CATEGORIES, SORTS} from './schema.js'
import {propAsArray, propAsBoolean, propAsString, sort, useDBChanged} from './db.js'
import {AND} from './query2.js'
import {format, formatDistanceToNow} from "date-fns"

import "./email.css"

const isMessage = () => ({ TYPE:CATEGORIES.EMAIL.TYPES.MESSAGE })
const isTask = () => ({ TYPE:CATEGORIES.TASKS.TYPES.TASK })
const isEmailCategory = () => ({ CATEGORY:CATEGORIES.EMAIL.ID })
const isPropTrue = (prop) => ({ equal: {prop, value:true}})
const isPropFalse = (prop) => ({ equal: {prop, value:false}})
const isPropEqual = (prop,value) => ({ equal: {prop, value}})
const isPropEqualId = (prop,obj) => ({ equal: {prop, value:obj?obj.id:null}})
const isPropSubstring = (prop,value) => ({ substring: {prop, value}})
const isPropContainsTag = (prop, tag) => ({contains: { prop, value:tag}})




function calculateFoldersFromTags(folders) {
    let tagset = new Set()
    folders.forEach(n => propAsArray(n,'tags').forEach(t => tagset.add(t)))
    return Array.from(tagset.values()).map((t,i)=>{
        return {
            id:3000+i,
            props: {
                title:t,
                icon:'hash',
                query:true,
                tag:true,
            }
        }
    })
}

export function Email({db, app, appService}) {
    useDBChanged(db,CATEGORIES.EMAIL.ID)

    const [selectedFolder, setSelectedFolder] = useState(null)
    const [selectedMessage, setSelectedMessage] = useState(null)

    let messages = db.QUERY(AND(isMessage(), isEmailCategory()))
    let folders = calculateFoldersFromTags(messages)

    let panel = <Panel grow>no message selected</Panel>
    if(selectedMessage) {
        panel = <Panel grow className="message-view">
            <HBox><i>From: </i><b>{propAsString(selectedMessage,'sender')}</b>
                <Spacer/>
                <b>{format(selectedMessage.props.timestamp,"PPp")}</b>
            </HBox>
            <HBox><i>To: </i><b>{propAsString(selectedMessage,'receivers')}</b></HBox>
            <HBox><label>subject</label><b>{propAsString(selectedMessage,'subject')}</b></HBox>
            <div className={"body"}>
                {propAsString(selectedMessage,'body')}
            </div>
        </Panel>
    }

    let folder_results = []
    if(selectedFolder) {
        if(propAsBoolean(selectedFolder,'query')) {
            let tag = propAsString(selectedFolder,'title')
            folder_results = db.QUERY(AND(isMessage(), isEmailCategory(), isPropContainsTag("tags",tag)))
        }
    }

    folder_results = sort(folder_results,["timestamp"], SORTS.DESCENDING)

    return <Window  app={app} appService={appService} resize width={600} height={400}>
        <VBox grow>
            <Toolbar>
                <button>new</button>
                <button>delete</button>
                <button>inbox</button>
                <input type="search"/>
            </Toolbar>
            <HBox grow>
                <DataList data={folders}
                          selected={selectedFolder}
                          setSelected={setSelectedFolder}
                          stringify={o => {
                              return <label>{propAsString(o,'title')}</label>
                          }}
                />
                <DataList data={folder_results}
                          selected={selectedMessage}
                          setSelected={setSelectedMessage}
                          stringify={o => {
                              return <VBox grow>
                                  <HBox grow>
                                      <b>{propAsString(o,'sender')}</b>
                                      <Spacer/>
                                      <i>{formatDistanceToNow(o.props.timestamp)}</i>
                                  </HBox>
                                  <label>{propAsString(o,'subject')}</label>
                              </VBox>
                }}/>
                {panel}
            </HBox>
            </VBox>
    </Window>
}
