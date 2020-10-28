import React, {useState} from 'react'
import {DataList, HBox, Panel, Spacer, Toolbar, VBox, Window} from './ui.js'
import {CATEGORIES} from './schema.js'
import {propAsArray, propAsBoolean, propAsString, useDBChanged} from './db.js'
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

    let panel = <div>no message selected</div>
    if(selectedMessage) {
        panel = <div style={{
            width:'100%',
            whiteSpace:"pre-line",
            padding:'1em',
        }}>{propAsString(selectedMessage,'body')}</div>
    }

    let folder_results = []
    if(selectedFolder) {
        if(propAsBoolean(selectedFolder,'query')) {
            let tag = propAsString(selectedFolder,'title')
            folder_results = db.QUERY(AND(isMessage(), isEmailCategory(), isPropContainsTag("tags",tag)))
        }
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
