import React, {useContext, useState} from 'react'
import {DataList, HBox, Panel, Spacer, StandardListItem, Toolbar, VBox, Window} from '../ui/ui.js'
import {CATEGORIES, SORTS} from '../schema.js'
import {DBContext, propAsBoolean, propAsString, sort, useDBChanged} from '../db.js'
import {AND, IS_CATEGORY, IS_PROP_CONTAINS, IS_TYPE} from '../query2.js'
import {format, formatDistanceToNow} from "date-fns"

import "./email.css"
import {calculateFoldersFromTags} from '../util.js'

export function Email({app }) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.EMAIL.ID)

    const [selectedFolder, setSelectedFolder] = useState(null)
    const [selectedMessage, setSelectedMessage] = useState(null)

    let messages = db.QUERY(AND(
        IS_CATEGORY(CATEGORIES.EMAIL.ID),
        IS_TYPE(CATEGORIES.EMAIL.TYPES.MESSAGE)))
    let folders = calculateFoldersFromTags(messages)

    let panel = <Panel grow className={'content-panel'}>no message selected</Panel>
    if(selectedMessage) {
        panel = <Panel grow className="message-view content-panel">
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
            folder_results = db.QUERY(AND(
                IS_CATEGORY(CATEGORIES.EMAIL.ID),
                IS_TYPE(CATEGORIES.EMAIL.TYPES.MESSAGE),
                IS_PROP_CONTAINS("tags",tag)))
        }
    }

    folder_results = sort(folder_results,["timestamp"], SORTS.DESCENDING)

    return <Window app={app}>
        <VBox grow>
            <Toolbar>
                <button>new</button>
                <button>delete</button>
                <button>inbox</button>
                <input type="search"/>
            </Toolbar>
            <HBox grow>
                <DataList data={folders}
                          className={'sidebar'}
                          selected={selectedFolder}
                          setSelected={setSelectedFolder}
                          stringify={o => {
                              let icon = "folder"
                              let title = propAsString(o,'title')
                              if(title === 'inbox') icon = 'inbox'
                              return <StandardListItem title={title} icon={icon}/>
                          }}
                />
                <DataList data={folder_results}
                          className={'sidebar'}
                          selected={selectedMessage}
                          setSelected={setSelectedMessage}
                          stringify={o => {
                              return <StandardListItem
                                  title={propAsString(o,'sender')}
                                  trailing_title={formatDistanceToNow(o.props.timestamp)}
                                  subtitle={propAsString(o,'subject')}
                                  />}}
                                  />

                {panel}
            </HBox>
            </VBox>
    </Window>
}
