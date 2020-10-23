import React, {useState} from 'react'
import {
    filterPropArrayContains, hasProp,
    propAsArray,
    propAsBoolean,
    propAsIcon,
    propAsString, useDBChanged
} from './db.js'
import {CATEGORIES} from './schema.js'
import {
    AddButton,
    DataList,
    HBox,
    TagsetEditor,
    TextareaPropEditor,
    TextPropEditor,
    Toolbar,
    VBox,
    Window
} from './ui.js'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {AND, OR, query2 as QUERY} from './query2.js'


const isPropSubstring = (prop,value) => ({ substring: {prop, value}})
const isNotesCategory = () => ({ CATEGORY:CATEGORIES.NOTES.ID })
const isNote = () => ({ TYPE:CATEGORIES.NOTES.TYPES.NOTE })
const isGroup = () => ({ TYPE:CATEGORIES.NOTES.TYPES.GROUP })

export function Notes({db, app, appService}) {
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
                icon:'hash',
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
            return QUERY(notes,OR(isPropSubstring('title',searchTerms), isPropSubstring('contents',searchTerms)))
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


    return <Window width={620} height={300} title={"notes"} className={'notes'} app={app} appService={appService}>
        <HBox grow>
            <DataList data={groups} selected={selectedGroup} setSelected={setSelectedGroup} stringify={renderProject}/>
            <VBox>
                <Toolbar>
                    <input type={'search'} value={searchTerms} onChange={e=>setSearchTerms(e.target.value)}/>
                    <AddButton onClick={addNewNote}/>
                </Toolbar>
                <DataList data={notes} selected={selectedNote} setSelected={setSelectedNote} stringify={renderNoteSummary}/>
            </VBox>
            <VBox grow>
                <TextPropEditor buffer={selectedNote} prop={'title'} db={db}/>
                <TagsetEditor buffer={selectedNote} prop={'tags'} db={db}/>
                <TextareaPropEditor buffer={selectedNote} prop={'contents'} db={db}/>
            </VBox>
        </HBox>
    </Window>
}


const renderProject = (o) => {
    let title = propAsString(o,'title')
    let icon = propAsIcon(o,'icon')
    return [icon,title]
}

const renderNoteSummary = (o) => {
    return propAsString(o, 'title') + " " + formatDistanceToNow(o.props.lastedited)
}
