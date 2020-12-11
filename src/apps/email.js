import React, {useContext, useState} from 'react'
import {HBox, InfoBar, Panel, Spacer, Toolbar} from '../ui/ui.js'
import {CATEGORIES, SORTS} from '../schema.js'
import {DBContext, propAsBoolean, propAsString, sort, useDBChanged} from '../db.js'
import {AND, IS_CATEGORY, IS_PROP_CONTAINS, IS_PROP_SUBSTRING, IS_TYPE, OR, query2 as QUERY} from '../query2.js'
import {format, formatDistanceToNow} from "date-fns"

import {calculateFoldersFromTags} from '../util.js'
import {Grid3Layout} from '../ui/grid3layout.js'
import {DataList, StandardSourceItem} from '../ui/dataList.js'
import Icon from '@material-ui/core/Icon'

export function Email({app }) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.EMAIL.ID)

    const [selectedFolder, setSelectedFolder] = useState(null)
    const [selectedMessage, setSelectedMessage] = useState(null)
    const [searchTerms, setSearchTerms] = useState("")

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

    if(searchTerms.length >= 2) folder_results = QUERY(folder_results,
        OR(IS_PROP_SUBSTRING('subject',searchTerms),
            IS_PROP_SUBSTRING('sender',searchTerms)
        ))


    folder_results = sort(folder_results,["timestamp"], SORTS.DESCENDING)

    return <Grid3Layout statusbar={false}>
        <InfoBar title={'Email'}/>
        <DataList
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

        <DataList column={2} row={2}
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

        <Toolbar>
            <input type={'search'} value={searchTerms} onChange={e => setSearchTerms(e.target.value)}/>
        </Toolbar>
        {panel}
    </Grid3Layout>
}

