import React, {useContext, useState} from 'react'
import {DBContext, filterPropArrayContains, hasProp, propAsBoolean, propAsString, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {TopToolbar} from '../ui/ui.js'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {AND, IS_CATEGORY, IS_PROP_SUBSTRING, IS_TYPE, OR, query2 as QUERY} from '../query2.js'
import Icon from '@material-ui/core/Icon'
import {calculateFoldersFromTags} from '../util.js'
import {Grid3Layout} from '../ui/grid3layout.js'
import {SourceList, StandardSourceItem} from '../ui/sourcelist.js'
import {TitleBar} from '../stories/email_example.js'
import {StandardEditPanel} from '../ui/StandardEditPanel.js'


const isNotesCategory = () => IS_CATEGORY(CATEGORIES.NOTES.ID)
const isNote = () => IS_TYPE(CATEGORIES.NOTES.TYPES.NOTE)
const isGroup = () => IS_TYPE(CATEGORIES.NOTES.TYPES.GROUP)

export function Notes({app}) {
    let db = useContext(DBContext)
    useDBChanged(db, CATEGORIES.NOTES.ID)

    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedNote, setSelectedNote] = useState(null)
    const [searchTerms, setSearchTerms] = useState("")

    let notes = db.QUERY(AND(isNotesCategory(),isNote()))
    let groups = db.QUERY(AND(isNotesCategory(),isGroup()))

    groups = groups.concat(calculateFoldersFromTags(notes))

    const addNewNote = () => {
        let note = db.make(CATEGORIES.NOTES.ID,CATEGORIES.NOTES.TYPES.NOTE)
        db.add(note)
        setSelectedNote(note)
    }

    const calcFilter = () => {
        if(searchTerms.length >= 2) {
            return QUERY(notes,OR(IS_PROP_SUBSTRING('title',searchTerms), IS_PROP_SUBSTRING('contents',searchTerms)))
        }
        if(propAsBoolean(selectedGroup,'tag')) {
            return filterPropArrayContains(notes,{tags:propAsString(selectedGroup,'title')})
        }
        if(propAsBoolean(selectedGroup,'query')  && hasProp(selectedGroup,'query_impl')) {
            return db.QUERY(selectedGroup.props.query_impl)
        }
        return notes
    }

    notes = calcFilter()

    return <Grid3Layout>
        <TitleBar title={'notes'}/>
        <SourceList data={groups} selected={selectedGroup} setSelected={setSelectedGroup}
                    column={1} row={2} secondary
                    renderItem={({item, ...args})=> <StandardSourceItem
                        icon={propAsString(item,'icon')}
                        title={propAsString(item,'title')}
                        {...args} />}/>

        <TopToolbar column={2}>
            <input type={'search'} value={searchTerms} onChange={e=>setSearchTerms(e.target.value)}/>
            <Icon onClick={addNewNote}>add_circle</Icon>
        </TopToolbar>

        <SourceList column={2} row={2} data={notes}
                    selected={selectedNote} setSelected={setSelectedNote}
                    renderItem={({item, ...args})=> <StandardSourceItem
                        icon={'note'}
                        title={propAsString(item,'title')}
                        subtitle={formatDistanceToNow(item.props.lastedited)}
                        {...args} />}/>

        <TopToolbar column={3}>
        </TopToolbar>
        <StandardEditPanel object={selectedNote} className={'col3 row2'} hide={['archived','deleted','lastedited']}/>
    </Grid3Layout>
}
