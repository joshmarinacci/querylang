import React, {useState} from 'react'
import {deepClone, filter, propAsBoolean, propAsString, query, setProp} from './db.js'
import {CATEGORIES, makeNewObject} from './schema.js'
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
import {HiPlusCircle} from 'react-icons/hi'
import {MdArchive, MdBorderOuter, MdCheckBox, MdCheckBoxOutlineBlank, MdDelete} from 'react-icons/md'

export function TaskLists({data}) {
    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedTask, setSelectedTask] = useState(null)

    let projects = query(data, {category: CATEGORIES.TASKS, type: CATEGORIES.TASKS.TYPES.PROJECT})
    projects = filter(projects, {active: true})
    let tasks = query(data, {category: CATEGORIES.TASKS, type: CATEGORIES.TASKS.TYPES.TASK})
    if(selectedProject) {
        if(propAsBoolean(selectedProject,'query')) {
            if(propAsString(selectedProject,'title') === 'archive') {
                tasks = filter(tasks, {archived:true})
            }
            if(propAsString(selectedProject,'title') === 'trash') {
                tasks = filter(tasks, {deleted:true})
            }
        } else {
            tasks = filter(tasks, {
                project: selectedProject ? selectedProject.id : null,
                archived:false,
                deleted:false,
            })
        }
    }

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


    let panel = <Panel grow={true}>nothing selected</Panel>
    if (selectedTask) {
        panel = <Panel grow={true}>
            <HBox>
                <span>{propAsString(selectedTask, 'title')}</span>
                <b>{propAsString(selectedTask, 'completed')}</b>
            </HBox>
            <p>{propAsString(selectedTask, 'notes')}</p>

        </Panel>
        if (editingTask) {
            panel = <Panel grow={true}>
                <TextPropEditor buffer={buffer} prop={'title'} onChange={updateBuffer}/>
                <CheckboxPropEditor buffer={buffer} prop={'completed'} onChange={updateBuffer}/>
                <TextareaPropEditor buffer={buffer} prop={'notes'}
                                    onChange={updateBuffer}/>
                <button onClick={saveEditing}>save</button>
                <button onClick={cancelEditing}>cancel</button>
            </Panel>
        }
    }

    const addNewTask = () => {
        let task = makeNewObject(CATEGORIES.TASKS.TYPES.TASK)
        setProp(task,'project',selectedProject.id)
        data.push(task)
    }

    const trashTask = () => {
        //mark as deleted
        if(selectedTask) setProp(selectedTask, 'deleted',true)
    }
    const archiveTask = () => {
        //mark as archived
        if(selectedTask) setProp(selectedTask, 'archived',true)
    }

    return <Window width={620} height={200} x={0} y={350} title={'tasks'} className={'tasks'}>
        <HBox grow>
            <DataList data={projects} stringify={(o => propAsString(o,'title'))} selected={selectedProject} setSelected={setSelectedProject}/>
            <VBox>
                <Toolbar>
                    <input type={'search'}/>
                    <button disabled={selectedProject===null} onClick={addNewTask} className={'no-border'}>
                        <HiPlusCircle className={'add-icon'}/>
                    </button>
                </Toolbar>
                <DataList data={tasks} stringify={(o) => {
                    return <HBox>
                        {propAsBoolean(o,'completed')?<MdCheckBox className={'checkbox-icon'}/>:<MdCheckBoxOutlineBlank/>}
                        <b>{propAsString(o,'title')}</b>
                        {/*<i>{propAsBoolean(o,'completed')?"*":"-"}</i>*/}
                    </HBox>
                }} selected={selectedTask} setSelected={setSelectedTask}/>

            </VBox>
            <VBox style={{flex:1}}>
                {panel}
                <Toolbar>
                    <Spacer/>
                    <button
                        disabled={!selectedProject}
                        onClick={toggleEditing}>edit
                    </button>
                    <MdArchive className={'icon'} onClick={archiveTask}/>
                    <MdDelete className={'icon'} onClick={trashTask}/>
                </Toolbar>
            </VBox>
        </HBox>
    </Window>
}