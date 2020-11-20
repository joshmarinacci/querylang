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
    Toolbar, TopToolbar,
    VBox,
    Window
} from '../ui/ui.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_PROP_SUBSTRING, IS_PROP_TRUE, IS_TYPE, query2 as QUERY} from '../query2.js'
import Icon from '@material-ui/core/Icon'
import {Grid3Layout} from '../ui/grid3layout.js'
import {SourceList, StandardSourceItem} from '../ui/sourcelist.js'
import {TitleBar} from '../stories/email_example.js'

const isProject = () => IS_TYPE(CATEGORIES.TASKS.TYPES.PROJECT)
const isTask = () => IS_TYPE(CATEGORIES.TASKS.TYPES.TASK)
const isTaskCategory = () => IS_CATEGORY(CATEGORIES.TASKS.ID)
const isPropFalse = (prop) => IS_PROP_EQUAL(prop,false)
const isPropEqualId = (prop,obj) => ({ equal: {prop, value:obj?obj.id:null}})



export function TaskLists({app}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.TASKS.ID)

    const [selectedProject, setSelectedProject] = useState(null)
    const [selectedTask, setSelectedTask] = useState(null)
    const [searchTerms, setSearchTerms] = useState("")

    let projects = db.QUERY(AND(isProject(), isTaskCategory(), IS_PROP_TRUE('active')))
    let tasks = db.QUERY(AND(isTaskCategory(), isTask()))


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
        tasks = QUERY(tasks,AND(IS_PROP_SUBSTRING('title',searchTerms)))
    }

    let panel = <Panel grow={true} className={"content-panel col3 row2"}>nothing selected</Panel>
    if (selectedTask) {
        panel = <Panel grow={true} className={"content-panel col3 row2"}>
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

    return <Grid3Layout statusbar={false}>
        <TitleBar title={'Tasks'}/>

        <SourceList column={1} row={2} data={projects}
                    selected={selectedProject} setSelected={setSelectedProject}
                    renderItem={({item, ...args})=><StandardSourceItem
                            icon={propAsString(item,'icon')}
                            title={propAsString(item,'title')}
                            {...args}/>}/>

        <TopToolbar column={2}>
            <input type={'search'} value={searchTerms} onChange={e => setSearchTerms(e.target.value)}/>
            <Icon disabled={selectedProject===null} onClick={addNewTask} className={'no-border'}>add_circle</Icon>
        </TopToolbar>
        <TopToolbar column={3}>
            <Spacer/>
            <Icon onClick={archiveTask}>archive</Icon>
            <Icon onClick={trashTask}>delete</Icon>
        </TopToolbar>

        <SourceList column={2} row={2} data={tasks}
                    selected={selectedTask} setSelected={setSelectedTask}
                    renderItem={({item, ...args})=><StandardSourceItem
                            icon={(propAsBoolean(item,'completed')?"check_box":"check_box_outline_blank")}
                            title={propAsString(item,'title')}
                            {...args}/>}/>
            {panel}
    </Grid3Layout>
}