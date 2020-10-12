import React, {useState} from 'react'
import {propAsIcon, propAsString, query, setProp} from './db.js'
import {CATEGORIES, makeNewObject} from './schema.js'
import {AddButton, DataList, HBox, TagsetEditor, TextareaPropEditor, Toolbar, VBox, Window} from './ui.js'
import {HiPlusCircle} from "react-icons/hi"
import {MdArchive, MdDelete} from 'react-icons/md'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'


export function Notes({data}) {
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selected, setSelected] = useState(null)


    let notes = query(data, {
        category: CATEGORIES.NOTES.ID,
        type: CATEGORIES.NOTES.TYPES.NOTE
    })
    let [groups] = useState(()=>[
        {
            id:199,
            props: {
                title: 'all',
                icon:'notes',
            }
        },
        {
            id:198,
            props: {
                title: 'archive',
                icon: 'archive',
            }
        },
        {
            id:197,
            props: {
                title: 'trash',
                icon: 'trash',
            }
        }
    ])


    const [title, setTitle] = useState("")
    const updateTitle = (e) => {
        setProp(selected,'title',e.target.value)
        setTitle(e.target.value)
    }
    const [tags, setTags] = useState('')
    const updateTags = (e) => {
        setTags(e.target.value)
    }
    const syncTags = (e) => {
        if(tags) {
            let val = tags.split(',')
            console.log("new tags ", val)
            setProp(selected, 'tags', val)
        }
    }

    const [contents, setContents] = useState('')
    const updateContents = (e) => {
        setProp(selected,'contents',e.target.value)
        setContents(e.target.value)
    }


    const doSetSelected = (val) => {
        console.log("selected",val)
        setSelected(val)
        setTitle(propAsString(val,'title'))
        setTags(propAsString(val,'tags'))
        setContents(propAsString(val,'contents'))
    }

    const addNewNote = () => {
        let note = makeNewObject(CATEGORIES.NOTES.TYPES.NOTE)
        data.push(note)
        console.log(note)
        doSetSelected(null)
    }

    const renderProject = (o,i) => {
        let title = propAsString(o,'title')
        let icon = propAsIcon(o,'icon')
        return <HBox key={i}>{icon} {title}</HBox>
    }

    return <Window width={620} height={300} x={0} y={580} title={"notes"} className={'notes'}>
        <HBox grow>
            <DataList data={groups}
                      selected={selectedGroup}
                      setSelected={setSelectedGroup}
                      stringify={renderProject}/>
            <VBox>
                <Toolbar>
                    <input type={'search'}/>
                    <AddButton onClick={addNewNote}/>
                </Toolbar>
                <DataList data={notes}
                          selected={selected}
                          setSelected={doSetSelected}
                          stringify={(o) => {
                              return propAsString(o, 'title') + " " + formatDistanceToNow(o.props.lastedited)
                          }}
                />
            </VBox>
            <VBox grow>
                <input type={'text'} value={title} onChange={updateTitle}/>
                <TagsetEditor buffer={selected} prop={'tags'} onChange={(o,k)=> setTags(o.props[k]) } onBlur={syncTags}/>
                <TextareaPropEditor buffer={selected} prop={'contents'} onChange={(o,k)=>setContents(o.props[k])}/>
            </VBox>
        </HBox>
    </Window>
}