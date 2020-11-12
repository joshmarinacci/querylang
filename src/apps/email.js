import React, {useContext, useState} from 'react'
import {HBox, Panel, Spacer, TopToolbar, VBox} from '../ui/ui.js'
import {CATEGORIES, SORTS} from '../schema.js'
import {DBContext, propAsBoolean, propAsString, sort, useDBChanged} from '../db.js'
import {AND, IS_CATEGORY, IS_PROP_CONTAINS, IS_TYPE} from '../query2.js'
import {format, formatDistanceToNow} from "date-fns"

import "./email.css"
import {calculateFoldersFromTags} from '../util.js'
import {Grid3Layout} from '../ui/grid3layout.js'
import {TitleBar} from '../stories/email_example.js'
import {SourceList} from '../ui/sourcelist.js'
import Icon from '@material-ui/core/Icon'

export function Email({app }) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.EMAIL.ID)

    const [selectedFolder, setSelectedFolder] = useState(null)
    const [selectedMessage, setSelectedMessage] = useState(null)

    let messages = db.QUERY(AND(
        IS_CATEGORY(CATEGORIES.EMAIL.ID),
        IS_TYPE(CATEGORIES.EMAIL.TYPES.MESSAGE)))
    let folders = calculateFoldersFromTags(messages)

    let panel = <Panel grow className={'col3 row2'}>no message selected</Panel>
    if(selectedMessage) {
        panel = <Panel grow className="message-view col3 row2">
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

    return <Grid3Layout>
        <TitleBar title={'Email'}/>
        <SourceList column={1} secondary data={folders} selected={selectedFolder} setSelected={setSelectedFolder}
                    renderItem={(obj,i) => <EmailFolder key={i} item={obj}/>}
        />

        <TopToolbar column={2}>
            <Icon>create</Icon>
            <Icon>delete</Icon>
            <Icon>archive</Icon>
        </TopToolbar>

        <SourceList column={2} data={folder_results} selected={selectedMessage} setSelected={setSelectedMessage}
                    renderItem={(obj,i) => <EmailMessage key={i} message={obj}/>}
        />

        <TopToolbar column={3}>
            <input type="search" placeholder={'search'}/>
        </TopToolbar>
        {panel}
    </Grid3Layout>
}

function EmailFolder({item}){
    if(propAsBoolean(item,'header')) {
        return <HBox className="folder header">
            {propAsString(item,'title')}
        </HBox>
    }

    let badge = ""
    if(item.props.count) {
        badge = <span className={'badge'}>{item.props.count}</span>
    }

    let icon = 'folder'
    if(propAsString(item,'title') === 'inbox') icon = 'inbox'
    return <HBox className="folder" center>
        <Icon className={'icon'}>{icon}</Icon>
        <span className={'title'}>{propAsString(item,'title')}</span>
        <Spacer/>
        {badge}
    </HBox>
}

function EmailMessage({message}) {
    let item = message
    return <VBox className={'email-item'}>
        <HBox>
            {/*<Icon className="small">{propAsBoolean(item,'read')?"brightness_1":""}</Icon>*/}
            <b className={'from'}>{propAsString(item,'sender')}</b>
            <Spacer/>
            <label className={'time'}>{formatDistanceToNow(item.props.timestamp)}</label>
        </HBox>
        <HBox>
            <i className={'subject'}>{propAsString(item,'subject')}</i>
            <Spacer/>
            {/*<Icon className="small">attachment</Icon>*/}
        </HBox>
        <HBox>
            <p className={'excerpt'}>{propAsString(item,'excerpt')}</p>
        </HBox>
    </VBox>
}
