import React, {useState} from 'react'
import './App.css';
import {DataList, HBox, Panel, VBox, Window} from './ui.js'
import {
  attach,
  deepClone,
  filter,
  find_in_collection,
  project,
  query,
  sort,
  propAsString,
  propAsBoolean, now, hourAsDateString
} from './db.js'

const CATEGORIES = {
  CONTACT:{
    ID:'CONTACT',
    TYPES:{
      PERSON:'PERSON'
    }
  },
  GENERAL: {
    ID:'GENERAL',
    TYPES:{
      COLLECTION:'COLLECTION'
    }
  },
  TASKS: {
    ID:'TASKS',
    TYPES:{
      PROJECT: "PROJECT",
      TASK:"TASK",
    }
  },
  CHAT: {
    ID:'CHAT',
    TYPES:{
      MESSAGE: 'MESSAGE',
      CONVERSATION:'CONVERSATION',
    }
  },
  SETTINGS:{
    ID:'SETTINGS',
    TYPES:{
      USER:'USER'
    }
  },
  CALENDAR: {
    ID:'CALENDAR',
    TYPES: {
      EVENT:'EVENT'
    }
  }
}
const DATA = [
  {
    id:1,
    category:CATEGORIES.CONTACT.ID,
    type:CATEGORIES.CONTACT.TYPES.PERSON,
    props:{
      first:'Josh',
      last:'Marinacci',
      emails:[
        {
          type:'personal',
          value:"joshua@marinacci.org",
        },
        {
          type: 'professional',
          value: "josh@josh.earth",
        }
      ],
      phone:[
        {
          type:'cell',
          value:'707-509-9627'
        }
      ],
      icon:'http://placekeanu.com/64/64/d',
    }
  },
  {
    id:2,
    category:CATEGORIES.CONTACT.ID,
    type:CATEGORIES.CONTACT.TYPES.PERSON,
    props:{
      first:'Jesse',
      last:'Marinacci',
      emails:[
        {
          type:'personal',
          value:"jessemarinacci@icloud.com",
        },
        {
          type: 'school',
          value: "jesse.marinacci@bsd52.org",
        }
      ],
      icon:'http://placekeanu.com/64/64/a',
    }
  },
  {
    id:3,
    category: CATEGORIES.CONTACT.ID,
    type:CATEGORIES.CONTACT.TYPES.PERSON,
    props: {
      first:'Cocoa',
      last:'',
      icon:'https://placekitten.com/64/65',
    }
  },
  {
    id:4,
    category: CATEGORIES.CONTACT.ID,
    type:CATEGORIES.CONTACT.TYPES.PERSON,
    props: {
      first:'Oreo',
      last:'',
      icon:'https://placekitten.com/64/64',
    }
  },
  {
    id:5,
    category: CATEGORIES.GENERAL.ID,
    type:CATEGORIES.GENERAL.TYPES.COLLECTION,
    props: {
      set:[1,3,2],
      name:'peoplebar'
    }
  },
  {
    id:6,
    category: CATEGORIES.TASKS.ID,
    type: CATEGORIES.TASKS.TYPES.PROJECT,
    props: {
      title:'work',
      active:true,
    }
  },
  {
    id:7,
    category: CATEGORIES.TASKS.ID,
    type: CATEGORIES.TASKS.TYPES.PROJECT,
    props: {
      title:'personal',
      active:true,
    }
  },
  {
    id:8,
    category: CATEGORIES.TASKS.ID,
    type: CATEGORIES.TASKS.TYPES.PROJECT,
    props: {
      title:'old stuff',
      active:false,
    }
  },
  {
    id:9,
    category: CATEGORIES.TASKS.ID,
    type: CATEGORIES.TASKS.TYPES.TASK,
    props: {
      title:'file expense report',
      project:6,
      completed:false,
      notes:'make sure to check the math before submitting'
    },
  },
  {
    id:10,
    category: CATEGORIES.TASKS.ID,
    type: CATEGORIES.TASKS.TYPES.TASK,
    props: {
      title:'pick up jesse',
      project:7,
      completed:true,
    },
  },
  {
    id:11,
    category: CATEGORIES.CHAT.ID,
    type: CATEGORIES.CHAT.TYPES.MESSAGE,
    props: {
      sender:1,
      receivers:[1,2,3],
      contents:'hi jesse',
      timestamp:2
    }
  },
  {
    id:12,
    category: CATEGORIES.CHAT.ID,
    type: CATEGORIES.CHAT.TYPES.MESSAGE,
    props: {
      sender:2,
      receivers:[1,2,3],
      contents:'hi daddy',
      timestamp:1
    }
  },
  {
    id:13,
    category: CATEGORIES.CHAT.ID,
    type: CATEGORIES.CHAT.TYPES.MESSAGE,
    props: {
      sender:3,
      receivers:[1,2,3],
      contents:'meow',
      timestamp:5,
    }
  },
  {
    id:14,
    category: CATEGORIES.CHAT.ID,
    type: CATEGORIES.CHAT.TYPES.CONVERSATION,
    props: {
      title:"cat chat",
      people:[1,2,3],
    }
  },
  {
    id:15,
    category: CATEGORIES.CHAT.ID,
    type: CATEGORIES.CHAT.TYPES.CONVERSATION,
    props: {
      title:"kid chat",
      people:[1,2],
    }
  },
  {
    id:16,
    category: CATEGORIES.CHAT.ID,
    type: CATEGORIES.CHAT.TYPES.MESSAGE,
    props: {
      sender:1,
      receivers:[1,2],
      contents:'have you done your homework?',
      timestamp:5,
    }
  },
  {
    id:17,
    category: CATEGORIES.SETTINGS.ID,
    type: CATEGORIES.CHAT.TYPES.MESSAGE,
    props: {
      contact:1, // contact card ID
    }
  },
  {
    id:18,
    category:CATEGORIES.CALENDAR.ID,
    type:CATEGORIES.CALENDAR.TYPES.EVENT,
    props: {
      title: 'flea meds',
      start:hourAsDateString(8),
    }
  },
  {
    id:19,
    category: CATEGORIES.CALENDAR.ID,
    type:CATEGORIES.CALENDAR.TYPES.EVENT,
    props: {
      title:'go to sleep',
      start:hourAsDateString(23)
    }
  }

]

function validateData(data) {
  data.forEach(o => {
    if(o.type === CATEGORIES.TASKS.TYPES.TASK) {
      if(!o.props.hasOwnProperty('notes')) {
        console.log("missing a note")
        o.props.notes = ''
      }
    }
  })
}
validateData(DATA)


const SORTS = {
  ASCENDING:"ASCENDING",
}



// eslint-disable-next-line no-unused-vars
function p(...args) {
  console.log(...args)
}

function App() {
  return <div>
    <ContactList data={DATA}/>
    <PeopleBar data={DATA}/>
    <TaskLists data={DATA}/>
    <Chat data={DATA}/>
    <Calendar data={DATA}/>
  </div>
}


function TextPropEditor({buffer,prop, onChange}) {
  return <HBox>
    <label>{prop}</label>
    <input type="text"
           value={propAsString(buffer,prop)}
           onChange={(ev)=>{
             buffer.props[prop] = ev.target.value
             onChange(buffer,prop)
           }}
    />

  </HBox>
}

function CheckboxPropEditor({buffer, prop, onChange}) {
  return <HBox>
    <label>{prop}</label>
    <input type="checkbox"
           checked={propAsBoolean(buffer,prop)}
           onChange={(ev)=>{
             buffer.props[prop] = ev.target.checked
             onChange(buffer,prop)
           }}
    />
  </HBox>
}

function TextareaPropEditor({buffer,prop,onChange}) {
  return <VBox>
    <label>{prop}</label>
    <textarea value={propAsString(buffer,prop)} onChange={(ev)=>{
      buffer.props[prop] = ev.target.value
      onChange(buffer,prop)
    }}/>
  </VBox>
}

function ContactList({data}) {
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)
  const [buffer, setBuffer] = useState({})

  const toggleEditing = () => {
    if(!editing && selected) {
      setBuffer(deepClone(selected))
      setEditing(true)
    }
  }

  const saveEditing = () => {
    Object.keys(selected.props).forEach(k => {
      selected.props[k] = buffer.props[k]
    })
    setEditing(false)
  }
  const cancelEditing = () => {
    setEditing(false)
  }

  const updateBuffer = (buffer, key,ev) => {
    setBuffer(deepClone(buffer))
  }

  // DATA where type === PERSON, sort ascending by [first, last], project(first,last,id)
  let items = query(data,{category:CATEGORIES.CONTACT, type:CATEGORIES.CONTACT.TYPES.PERSON})
  items = sort(items,["first","last"],SORTS.ASCENDING)
  items = project(items,["first","last","id"])

  let panel = <Panel grow>nothing selected</Panel>
  if(selected) {
    panel = <Panel grow>
      {propAsString(selected,'first')}
      {propAsString(selected,'last')}
      <img src={selected.props.icon}/>
    </Panel>
    if(editing) {
      panel = <Panel grow>
        <TextPropEditor buffer={buffer} prop={'first'} onChange={updateBuffer}/>
        <TextPropEditor buffer={buffer} prop={'last'} onChange={updateBuffer}/>
        <button onClick={saveEditing}>save</button>
        <button onClick={cancelEditing}>cancel</button>
      </Panel>
    }
  }

  return <Window width={500} height={250} title={'contacts'}>
    <HBox grow>
      <DataList data={items} selected={selected} setSelected={setSelected}
                stringify={o => propAsString(o,'first') + " " + propAsString(o,'last')}/>
      <VBox grow>
        {panel}
        <button
            disabled={!selected}
            onClick={toggleEditing}>edit</button>
      </VBox>
    </HBox>
  </Window>
}

function PeopleBar({data}) {
  // set = DATA where type === COLLECTION and name === 'peoplebar'
  // items = DATA where id in set
  let items = query(data, {category: CATEGORIES.GENERAL, type:CATEGORIES.GENERAL.TYPES.COLLECTION})
  let collection = filter(items,{name:'peoplebar'})[0]
  items =  find_in_collection(collection,data)
  return <Window width={100} height={300} y={300} title={'people'}>
    <ul className={'list'}>{items.map(o=>{
      return <li key={o.id}>{propAsString(o,'first')}
        <img src={o.props.icon} alt={'user-icon'}/>
      </li>
    })}</ul>
  </Window>
}

function TaskLists({data}) {
  const [selected, setSelected] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)

  let projects = query(data,{category:CATEGORIES.TASKS, type:CATEGORIES.TASKS.TYPES.PROJECT})
  projects = filter(projects, {active:true})
  let tasks = query(data, {category:CATEGORIES.TASKS, type:CATEGORIES.TASKS.TYPES.TASK})
  tasks = filter(tasks, {project:selected?selected.id:null})

  let [editingTask, setEditingTask] = useState(false)

  let [buffer, setBuffer] = useState({})

  const toggleEditing = () => {
    if(!editingTask && selectedTask) {
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

  const updateBuffer = (buffer, key,ev) => {
    setBuffer(deepClone(buffer))
  }


  let panel = <Panel>nothing selected</Panel>
  if(selectedTask) {
    panel = <Panel>
      <HBox>
        <span>{propAsString(selectedTask,'title')}</span>
        <b>{propAsString(selectedTask,'completed')}</b>
      </HBox>
      <p>{propAsString(selectedTask,'notes')}</p>

    </Panel>
    if(editingTask) {
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

  return <Window width={500} height={300} x={200} y={300} title={'tasks'}>
    <HBox grow>
      <ul className={'list'}>{projects.map(o=> {
        return <li key={o.id}
                   onClick={()=>{
                     setSelected(o)
                     setSelectedTask(null)
                   }}
                   className={selected===o?"selected":""}
        >{propAsString(o, 'title')}</li>
      })}</ul>
      <ul className={'list'}>{tasks.map(o=> {
        return <li key={o.id}
                   onClick={()=>setSelectedTask(o)}
                   className={selectedTask===o?"selected":""}
        >
          {propAsString(o, 'title')}
        </li>
      })}</ul>
      <VBox>
      {panel}
      <button
          disabled={!selected}
          onClick={toggleEditing}>edit</button>
      </VBox>
    </HBox>
  </Window>
}


function Chat({data}) {
  const [selected, setSelected] = useState(null)
  let conversations = query(data, {category:CATEGORIES.CHAT, type:CATEGORIES.CHAT.TYPES.CONVERSATION})

  let messages =[]

  if(selected) {
    messages = query(data, {category:CATEGORIES.CHAT, type:CATEGORIES.CHAT.TYPES.MESSAGE})
    messages = filter(messages,{receivers:selected.props.people})
  }

  let people = query(data,{category:CATEGORIES.CONTACT, type:CATEGORIES.CONTACT.TYPES.PERSON})
  messages = attach(messages,people,'sender','id')
  messages = sort(messages,['timestamp'])

  // conversations = attach_in(conversations,people,'people','id')

  return <Window width={400} height={250} x={600} y={0} title={'chat'}>
    <HBox>
      <DataList
          data={conversations}
          selected={selected}
          setSelected={setSelected}
          stringify={(o)=>propAsString(o,'title')}
      />
      <DataList data={messages} stringify={(o)=>{
        return propAsString(o,'timestamp') + propAsString(o.props.sender,'first') + propAsString(o,'contents')
      }}/>
    </HBox>
    </Window>
}

function Calendar({data}) {
  let events = query(data,{category:CATEGORIES.CALENDAR, type:CATEGORIES.CALENDAR.TYPES.EVENT})

  return <Window width={300} height={300} x={750} y={300} title={'calendar'}
    >
    <h1>October 8th, 2020</h1>
    <h2>Thursday</h2>
    <DataList data={events}
              stringify={o => {
                let start = new Date(o.props.start)
                return  start.toTimeString()
                    + propAsString(o,'title')
              }}
    />
  </Window>
}

function DataDumpPanel({data}) {
  return <ul>
    {data.map(o => {
      return <li>{o.category}</li>
    })}
  </ul>
  return <div>some data</div>
}
export default App;
