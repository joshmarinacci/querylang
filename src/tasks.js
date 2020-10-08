import React, {useState} from 'react'
import {deepClone, filter, propAsBoolean, propAsString, query} from './db.js'
import {CATEGORIES} from './schema.js'
import {
    CheckboxPropEditor,
    DataList,
    HBox,
    Panel, Spacer,
    TextareaPropEditor,
    TextPropEditor,
    Toolbar,
    VBox,
    Window
} from './ui.js'

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

    return <Window width={620} height={200} x={0} y={350} title={'tasks'}>
        <HBox grow>
            <DataList data={projects} stringify={(o => propAsString(o,'title'))} selected={selected} setSelected={setSelected}/>
            <DataList data={tasks} stringify={(o) => {
                return <div>
                    <b>{propAsString(o,'title')}</b>
                    <i>{propAsBoolean(o,'completed')?"*":"-"}</i>
                </div>
            }} selected={selectedTask} setSelected={setSelectedTask}/>
            <VBox style={{flex:1}}>
                {panel}
                <Toolbar>
                    <Spacer/>
                    <button
                        disabled={!selected}
                        onClick={toggleEditing}>edit
                    </button>
                </Toolbar>
            </VBox>
        </HBox>
    </Window>
}