import React, {useContext, useState} from 'react'
import {DBContext, hasProp, propAsBoolean, propAsString, setProp, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {
    CheckboxPropEditor,
    DataList,
    HBox,
    Panel, Spacer, StandardListItem,
    TextareaPropEditor,
    TextPropEditor,
    Toolbar,
    VBox,
    Window
} from '../ui/ui.js'
import {AND, query2 as QUERY} from '../query2.js'
import Icon from '@material-ui/core/Icon'

const isProject = () => ({ TYPE:CATEGORIES.TASKS.TYPES.PROJECT })
const isTask = () => ({ TYPE:CATEGORIES.TASKS.TYPES.TASK })
const isTaskCategory = () => ({ CATEGORY:CATEGORIES.TASKS.ID })
const isPropTrue = (prop) => ({ equal: {prop, value:true}})
const isPropFalse = (prop) => ({ equal: {prop, value:false}})
// const isPropEqual = (prop,value) => ({ equal: {prop, value}})
const isPropEqualId = (prop,obj) => ({ equal: {prop, value:obj?obj.id:null}})
const isPropSubstring = (prop,value) => ({ substring: {prop, value}})



export function TaskLists({app}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.TASKS.ID)

    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedTask, setSelectedTask] = useState(null)


    let projects = db.QUERY(AND(isProject(), isTaskCategory(), isPropTrue('active')))
    let tasks = db.QUERY(AND(isTaskCategory(), isTask()))

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
        }
    }

    if(searchTerms.length > 1) {
        tasks = QUERY(tasks,AND(isPropSubstring('title',searchTerms)))
    }

    let panel = <Panel grow={true}>nothing selected</Panel>
    if (selectedTask) {
        panel = <Panel grow={true}>
            <TextPropEditor buffer={selectedTask} prop={'title'} db={db}/>
            <CheckboxPropEditor buffer={selectedTask} prop={'completed'} db={db}/>
            <TextareaPropEditor buffer={selectedTask} prop={'notes'} db={db}/>
        </Panel>
    }

    const addNewTask = () => {
        let task = db.make(CATEGORIES.TASKS.ID, CATEGORIES.TASKS.TYPES.TASK)
        setProp(task,'project',selectedProject.id)
        db.add(task)
    }

    const trashTask = () => db.setProp(selectedTask,'deleted',true)
    const archiveTask = () => db.setProp(selectedTask, 'archived',true)

    return <Window app={app}>
        <HBox grow>
            <DataList data={projects} selected={selectedProject} setSelected={setSelectedProject}
                      stringify={((o,i) => <StandardListItem key={i}
                                                             icon={propAsString(o,'icon')}
                                                             title={propAsString(o,'title')}/>)}
            />
            <VBox>
                <Toolbar>
                    <input type={'search'} value={searchTerms} onChange={e => setSearchTerms(e.target.value)}/>
                    <Icon disabled={selectedProject===null} onClick={addNewTask} className={'no-border'}>add_circle</Icon>
                </Toolbar>
                <DataList data={tasks}  selected={selectedTask} setSelected={setSelectedTask}
                          stringify={(o,i) => <StandardListItem key={i}
                                                               icon={(propAsBoolean(o,'completed')?"check_box":"check_box_outline_blank")}
                                                               title={propAsString(o,'title')}/>}
                />

            </VBox>
            <VBox style={{flex:1}}>
                {panel}
                <Toolbar>
                    <Spacer/>
                    <Icon onClick={archiveTask}>archive</Icon>
                    <Icon onClick={trashTask}>delete</Icon>
                </Toolbar>
            </VBox>
        </HBox>
    </Window>
}