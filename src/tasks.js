import React, {useState} from 'react'
import {deepClone, filter, propAsBoolean, propAsIcon, propAsString, query, setProp} from './db.js'
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

    let [refresh, setRefresh] = useState(false)
    let [searchTerms, setSearchTerms] = useState("")

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

    if(searchTerms.length > 1) {
        tasks = filter(tasks, {title:searchTerms})
    }

    const doRefresh = () => setRefresh(!refresh)

    let panel = <Panel grow={true}>nothing selected</Panel>
    if (selectedTask) {
        panel = <Panel grow={true}>
            <TextPropEditor buffer={selectedTask} prop={'title'} onChange={doRefresh}/>
            <CheckboxPropEditor buffer={selectedTask} prop={'completed'} onChange={doRefresh}/>
            <TextareaPropEditor buffer={selectedTask} prop={'notes'} onChange={doRefresh}/>
        </Panel>
    }

    const addNewTask = () => {
        let task = makeNewObject(CATEGORIES.TASKS.TYPES.TASK)
        setProp(task,'project',selectedProject.id)
        data.push(task)
    }

    const trashTask = () => {
        //mark as deleted
        if(selectedTask) setProp(selectedTask, 'deleted',true)
        doRefresh()
    }
    const archiveTask = () => {
        //mark as archived
        if(selectedTask) setProp(selectedTask, 'archived',true)
        doRefresh()
    }

    return <Window width={620} height={200} x={0} y={350} title={'tasks'} className={'tasks'}>
        <HBox grow>
            <DataList data={projects} stringify={((o,i) => <HBox key={i}>{propAsIcon(o,'icon')} {propAsString(o,'title')}</HBox>)} selected={selectedProject} setSelected={setSelectedProject}/>
            <VBox>
                <Toolbar>
                    <input type={'search'} value={searchTerms} onChange={(e)=>{
                        setSearchTerms(e.target.value)
                    }}/>
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
                    <MdArchive className={'icon'} onClick={archiveTask}/>
                    <MdDelete className={'icon'} onClick={trashTask}/>
                </Toolbar>
            </VBox>
        </HBox>
    </Window>
}