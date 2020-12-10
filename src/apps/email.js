import React, {useContext, useState} from 'react'
import {HBox, Panel, Spacer, Toolbar, TopToolbar} from '../ui/ui.js'
import {CATEGORIES, SORTS} from '../schema.js'
import {DBContext, propAsBoolean, propAsString, sort, useDBChanged} from '../db.js'
import {AND, IS_CATEGORY, IS_PROP_CONTAINS, IS_TYPE} from '../query2.js'
import {format, formatDistanceToNow} from "date-fns"

import {calculateFoldersFromTags} from '../util.js'
import {Grid3Layout} from '../ui/grid3layout.js'
import {TitleBar} from '../stories/email_example.js'
import {SourceList, StandardSourceItem} from '../ui/sourcelist.js'
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
        <SourceList
            column={1} row={2}
            secondary
            data={folders}
            selected={selectedFolder} setSelected={setSelectedFolder}
            renderItem={({item,...rest})=>{
                return <StandardSourceItem
                    title={propAsString(item,'title')}
                    icon={propAsString(item,'icon')}
                    {...rest}/>
            }}
        />

        <Toolbar>
            <Icon>create</Icon>
            <Icon>delete</Icon>
            <Icon>archive</Icon>
        </Toolbar>

        <SourceList column={2} row={2}
                    data={folder_results}
                    selected={selectedMessage} setSelected={setSelectedMessage}
                    renderItem={({item,...rest}) => {
                        return <StandardSourceItem {...rest}
                                                   title={propAsString(item,'sender')}
                                                   subtitle={propAsString(item,'subject')}
                                                   trailing_text={formatDistanceToNow(item.props.timestamp)}
                        />
                    }}
        />

        <TopToolbar column={3}>
            <input type="search" placeholder={'search'}/>
        </TopToolbar>
        {panel}
    </Grid3Layout>
}

