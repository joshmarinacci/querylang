import React, {useState} from 'react'
import {deepClone, filter, propAsString, query} from './db.js'
import {CATEGORIES} from './schema.js'
import {CheckboxPropEditor, HBox, Panel, TextareaPropEditor, TextPropEditor, VBox, Window} from './ui.js'

export function TaskLists({data}) {
    const [selected, setSelected] = useState(null)
    const [selectedTask, setSelectedTask] = useState(null)

    let projects = query(data, {category: CATEGORIES.TASKS, type: CATEGORIES.TASKS.TYPES.PROJECT})
    projects = filter(projects, {active: true})
    let tasks = query(data, {category: CATEGORIES.TASKS, type: CATEGORIES.TASKS.TYPES.TASK})
    tasks = filter(tasks, {project: selected ? selected.id : null})

    let [editingTask, setEditingTask] = useState(false)

    let [buffer, setBuffer] = useState({})

    const toggleEditing = () => {
        if (!editingTask && selectedTask) {
            setBuffer(deepClone(selectedTask))
            setEditingTask(true)
        }
    }

    const saveEditing = () => {
        Object.keys(selectedTask.props).forEach(k => {
            selectedTask.props[k] = buffer.props[k]
        })
        setEditingTask(false)
    }
    const cancelEditing = () => {
        setEditingTask(false)
    }

    const updateBuffer = (buffer, key, ev) => {
        setBuffer(deepClone(buffer))
    }


    let panel = <Panel>nothing selected</Panel>
    if (selectedTask) {
        panel = <Panel>
            <HBox>
                <span>{propAsString(selectedTask, 'title')}</span>
                <b>{propAsString(selectedTask, 'completed')}</b>
            </HBox>
            <p>{propAsString(selectedTask, 'notes')}</p>

        </Panel>
        if (editingTask) {
            panel = <Panel>
                <TextPropEditor buffer={buffer} prop={'title'} onChange={updateBuffer}/>
                <CheckboxPropEditor buffer={buffer} prop={'completed'} onChange={updateBuffer}/>
                <TextareaPropEditor buffer={buffer} prop={'notes'}
                                    onChange={updateBuffer}/>
                <button onClick={saveEditing}>save</button>
                <button onClick={cancelEditing}>cancel</button>
            </Panel>
        }
    }

    return <Window width={400} height={200} x={0} y={350} title={'tasks'}>
        <HBox grow>
            <ul className={'list'}>{projects.map(o => {
                return <li key={o.id}
                           onClick={() => {
                               setSelected(o)
                               setSelectedTask(null)
                           }}
                           className={selected === o ? "selected" : ""}
                >{propAsString(o, 'title')}</li>
            })}</ul>
            <ul className={'list'}>{tasks.map(o => {
                return <li key={o.id}
                           onClick={() => setSelectedTask(o)}
                           className={selectedTask === o ? "selected" : ""}
                >
                    {propAsString(o, 'title')}
                </li>
            })}</ul>
            <VBox>
                {panel}
                <button
                    disabled={!selected}
                    onClick={toggleEditing}>edit
                </button>
            </VBox>
        </HBox>
    </Window>
}