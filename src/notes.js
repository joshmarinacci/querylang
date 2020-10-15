import React, {useState} from 'react'
import {
    filterPropArrayContains,
    propAsArray,
    propAsBoolean,
    propAsIcon,
    propAsString,
    query
} from './db.js'
import {CATEGORIES, makeNewObject} from './schema.js'
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


export function Notes({data}) {
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedNote, setSelectedNote] = useState(null)
    const [searchTerms, setSearchTerms] = useState("")
    const [refresh, setRefresh] = useState(false)
    const doRefresh = () => setRefresh(!refresh)

    let notes = query(data, {
        category: CATEGORIES.NOTES.ID,
        type: CATEGORIES.NOTES.TYPES.NOTE
    })

    let groups = [{
            id:199,
            props: {
                title: 'all',
                icon:'notes',
                query:true,
            }
        },
        {
            id:198,
            props: {
                title: 'archive',
                icon: 'archive',
                query:true,
            }
        },
        {
            id:197,
            props: {
                title: 'trash',
                icon: 'trash',
                query:true,
            }
        }
    ]


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
        let note = makeNewObject(CATEGORIES.NOTES.TYPES.NOTE)
        data.push(note)
        setSelectedNote(note)
    }

    const calcFilter = () => {
        if(searchTerms.length >= 2) {
            return QUERY(notes,OR(
                { substring: { prop:'title', value: searchTerms}},
                { substring: { prop:'contents', value: searchTerms}},
                ))
        }
        if(propAsBoolean(selectedGroup,'query')) {
            if(propAsString(selectedGroup,'title') === 'archive') {
                return QUERY(notes,AND({equal:{prop:'archived', value:true}}))
            }
            if(propAsString(selectedGroup,'title') === 'trash') {
                return QUERY(notes,AND({equal:{prop:'deleted', value:true}}))
            }
            if(propAsBoolean(selectedGroup,'tag')) {
                return filterPropArrayContains(notes,{tags:propAsString(selectedGroup,'title')})
            }
        }
        return notes
    }

    notes = calcFilter()


    return <Window width={620} height={300} x={0} y={580} title={"notes"} className={'notes'}>
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
                <TextPropEditor buffer={selectedNote} prop={'title'} onChange={doRefresh}/>
                <TagsetEditor buffer={selectedNote} prop={'tags'} onChange={doRefresh}/>
                <TextareaPropEditor buffer={selectedNote} prop={'contents'} onChange={doRefresh}/>
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
