import React, {useState} from 'react'
import {filterSubstring, project, propAsArray, propAsIcon, propAsString, query, setProp} from './db.js'
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


    let groups = [{
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
    ]


    let tagset = new Set()
    notes.forEach(n => propAsArray(n,'tags').forEach(t => tagset.add(t)))

    Array.from(tagset.values()).forEach((t,i)=>{
        groups.push({
            id:3000+i,
            props: {
                title:t,
                icon:'hash'
            }
        })
    })

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
        setSelected(val)
        setTitle(propAsString(val,'title'))
        setTags(propAsString(val,'tags'))
        setContents(propAsString(val,'contents'))
    }

    const addNewNote = () => {
        let note = makeNewObject(CATEGORIES.NOTES.TYPES.NOTE)
        data.push(note)
        doSetSelected(null)
    }

    const renderProject = (o,i) => {
        let title = propAsString(o,'title')
        let icon = propAsIcon(o,'icon')
        return <div style={{
            border:'0px solid red',
            display:'flex',
            flexDirection:'row',
            alignContent:'center',
        }} key={i}>{icon} {title}</div>
    }

    let [searchTerms, setSearchTerms] = useState("")

    if(searchTerms.length > 1) notes = filterSubstring(notes, {title:searchTerms})


    return <Window width={620} height={300} x={0} y={580} title={"notes"} className={'notes'}>
        <HBox grow>
            <DataList data={groups}
                      selected={selectedGroup}
                      setSelected={setSelectedGroup}
                      stringify={renderProject}/>
            <VBox>
                <Toolbar>
                    <input type={'search'} value={searchTerms} onChange={(e)=>{
                        setSearchTerms(e.target.value)
                    }}/>
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