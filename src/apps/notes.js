import React, {useContext, useState} from 'react'
import {
    DBContext,
    filterPropArrayContains, hasProp,
    propAsArray,
    propAsBoolean,
    propAsIcon,
    propAsString, useDBChanged
} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {
    DataList,
    HBox, Panel, StandardListItem,
    TagsetEditor,
    TextareaPropEditor,
    TextPropEditor,
    Toolbar,
    VBox,
    Window
} from '../ui/ui.js'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {AND, IS_CATEGORY, IS_PROP_SUBSTRING, IS_TYPE, OR, query2 as QUERY} from '../query2.js'
import Icon from '@material-ui/core/Icon'


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
    let tagset = new Set()
    notes.forEach(n => propAsArray(n,'tags').forEach(t => tagset.add(t)))

    Array.from(tagset.values()).forEach((t,i)=>{
        groups.push({
            id:3000+i,
            props: {
                title:t,
                icon:'label',
                query:true,
                tag:true,
            }
        })
    })

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


    return <Window app={app}>
        <HBox grow>
            <DataList data={groups} selected={selectedGroup} setSelected={setSelectedGroup} stringify={renderProject} className={'sidebar'}/>
            <VBox scroll>
                <Toolbar>
                    <input type={'search'} value={searchTerms} onChange={e=>setSearchTerms(e.target.value)}/>
                    <Icon onClick={addNewNote}>add_circle</Icon>
                </Toolbar>
                <DataList data={notes} selected={selectedNote} setSelected={setSelectedNote} stringify={renderNoteSummary} className={'sidebar'}/>
            </VBox>
            <VBox grow className={'content-panel'}>
                <TextPropEditor buffer={selectedNote} prop={'title'} db={db}/>
                <TagsetEditor buffer={selectedNote} prop={'tags'} db={db}/>
                <TextareaPropEditor buffer={selectedNote} prop={'contents'} db={db} grow/>
            </VBox>
        </HBox>
    </Window>
}


const renderProject = (o) => {
    return <StandardListItem
        title={propAsString(o,'title')}
        icon={propAsString(o,'icon')}/>
}

const renderNoteSummary = (o) => {
    return <StandardListItem
        icon={'note'}
        title={propAsString(o,'title')}
        subtitle={formatDistanceToNow(o.props.lastedited)}/>
}
