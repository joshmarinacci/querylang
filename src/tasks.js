import React, {useState} from 'react'
import {hasProp, propAsBoolean, propAsIcon, propAsString, setProp} from './db.js'
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
import {MdArchive, MdCheckBox, MdCheckBoxOutlineBlank, MdDelete} from 'react-icons/md'
import {AND, query2 as QUERY} from './query2.js'

const isProject = () => ({ TYPE:CATEGORIES.TASKS.TYPES.PROJECT })
const isTask = () => ({ TYPE:CATEGORIES.TASKS.TYPES.TASK })
const isTaskCategory = () => ({ CATEGORY:CATEGORIES.TASKS.ID })
const isPropTrue = (prop) => ({ equal: {prop, value:true}})
const isPropFalse = (prop) => ({ equal: {prop, value:false}})
const isPropEqual = (prop,value) => ({ equal: {prop, value}})
const isPropEqualId = (prop,obj) => ({ equal: {prop, value:obj?obj.id:null}})
const isPropSubstring = (prop,value) => ({ substring: {prop, value}})


export function TaskLists({db}) {
    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedTask, setSelectedTask] = useState(null)


    let projects = db.QUERY(AND(isProject(), isTaskCategory(), isPropTrue('active')))
    let tasks = db.QUERY(AND(isTaskCategory(), isTask()))
    console.log("all tasks are",tasks)

    let [refresh, setRefresh] = useState(false)
    let [searchTerms, setSearchTerms] = useState("")

    if(selectedProject) {
        if(propAsBoolean(selectedProject,'query')  && hasProp(selectedProject,'query_impl')) {
            tasks = db.QUERY(selectedProject.props.query_impl)
        } else {
            tasks = QUERY(tasks, AND(
                isPropEqualId('project',selectedProject),
                isPropFalse('archived'),
                isPropFalse('deleted')
                ))
            console.log("checking tasks",tasks.length)
        }
    }

    if(searchTerms.length > 1) {
        tasks = QUERY(tasks,AND(isPropSubstring('title',searchTerms)))
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
        let task = makeNewObject(CATEGORIES.TASKS.TYPES.TASK, CATEGORIES.TASKS.ID)
        setProp(task,'project',selectedProject.id)
        db.add(task)
        console.log("doing a new task")
        doRefresh()
    }

    const trashTask = () => {
        setProp(selectedTask, 'deleted',true)
        doRefresh()
    }
    const archiveTask = () => {
        setProp(selectedTask, 'archived',true)
        doRefresh()
    }

    console.log("rendering", tasks)
    return <Window width={620} height={200} x={0} y={350} title={'tasks'} className={'tasks'}>
        <HBox grow>
            <DataList data={projects} selected={selectedProject} setSelected={setSelectedProject}
                      stringify={((o,i) => <HBox key={i}>
                          {propAsIcon(o,'icon')}
                          {propAsString(o,'title')}
                      </HBox>)}
            />
            <VBox>
                <Toolbar>
                    <input type={'search'} value={searchTerms} onChange={(e)=>{
                        setSearchTerms(e.target.value)
                    }}/>
                    <button disabled={selectedProject===null} onClick={addNewTask} className={'no-border'}>
                        <HiPlusCircle className={'add-icon'}/>
                    </button>
                </Toolbar>
                <DataList data={tasks}  selected={selectedTask} setSelected={setSelectedTask}
                          stringify={(o) => {
                              return <HBox>
                                  {propAsBoolean(o,'completed')?<MdCheckBox className={'checkbox-icon'}/>:<MdCheckBoxOutlineBlank/>}
                                  <b>{propAsString(o,'title')}</b>
                              </HBox>
                          }}
                />

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