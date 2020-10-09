import React, {useState} from 'react'
import {propAsString, query, setProp} from './db.js'
import {CATEGORIES, makeNewObject} from './schema.js'
import {DataList, HBox, Toolbar, VBox, Window} from './ui.js'

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
            title:'all'
        },
        {
            id:198,
            title:'archive'
        },
        {
            id:197,
            title:'trash'
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

    return <Window width={620} height={300} x={0} y={580} title={"notes"} className={'notes'}>
        <HBox grow>
            <DataList data={groups}
                      selected={selectedGroup}
                      setSelected={setSelectedGroup}
                      stringify={(o)=>propAsString(o,'title')}
                      />
            <VBox>
                <Toolbar>
                    <input type={'search'}/>
                    <button onClick={addNewNote}>+</button>
                </Toolbar>
                <DataList data={notes}
                          selected={selected}
                          setSelected={doSetSelected}
                          stringify={(o) => {
                              return propAsString(o, 'title') + " " + propAsString(o,'lastedited')
                          }}
                />
            </VBox>
            <VBox grow>
                <input type={'text'} value={title} onChange={updateTitle}/>
                <input type={'text'} value={tags} onChange={updateTags} onBlur={syncTags}/>
                <textarea style={{
                    flex: 1.0,
                    border: '1px solid black',
                    padding: '1.0em',
                    margin: 0,
                }}
                    value={propAsString(selected,'contents')}
                          onChange={updateContents}
                />
            </VBox>
        </HBox>
    </Window>
}