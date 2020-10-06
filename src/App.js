import React, {useState} from 'react'
import './App.css';

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
      icon:'http://placekeanu.com/64/64/b',
    }
  },
  {
    id:4,
    category: CATEGORIES.CONTACT.ID,
    type:CATEGORIES.CONTACT.TYPES.PERSON,
    props: {
      first:'Oreo',
      icon:'http://placekeanu.com/64/64/c',
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
  }
]


const SORTS = {
  ASCENDING:"ASCENDING",
}


function query(data,opts) {
  if(opts.type) {
    data = data.filter(o => o.type === opts.type)
  }
  return data
}

function sort(items,sortby,sortorder) {
  items = items.slice()
    items.sort((a,b)=>{
    let key = sortby[0]
    if(a.props[key] === b.props[key]) return 0
    if(a.props[key]>b.props[key]) return 1
    return -1
  })
  return items
}

function project(items,propsarray) {
  return items
}

function toString(s,key) {
  if(!s) return "--missing--"
  if(s.props.hasOwnProperty(key)) {
    let v = s.props[key]
    if(v === true) return "true"
    if(v === false) return "false"
  }
  return s.props[key]
}

function filter(list,opts) {
  return list.filter(o => {
    let pass = true
    Object.keys(opts).forEach(k=>{
      let v = opts[k]
      // console.log("key",k,'value',v)
      if(!o.props.hasOwnProperty(k)) {
        pass = false
        return
      }
      if(o.props[k] !== v) {
        pass = false
        return
      }
    })
    return pass
  })
}

function find_in_collection(coll,data) {
  return data.filter(o => coll.props.set.some(id=>id===o.id))
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
  </div>
}

function HBox ({children, grow}) {
  return <div className={'hbox ' + (grow?"grow":"")}>{children}</div>
}
function VBox ({children, grow}) {
  return <div className={'vbox ' + (grow?"grow":"")}>{children}</div>
}
function Panel({children, grow}) {
  return <div className={'panel ' + (grow?"grow":"")}>{children}</div>
}
function Window({x,y,width,height,children,title}) {
  let style = {
    width: width ? (width + "px") : "100px",
    height: height ? (height + "px") : "100px",
    position:'absolute',
    left:x?(x+'px'):'0px',
    top:y?(y+'px'):'0px',
  }
  return <div className={"window"} style={style}>
    <title>{title}</title>
    {children}</div>
}

function ContactList({data}) {
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)

  // DATA where type === PERSON, sort ascending by [first, last], project(first,last,id)
  let items = query(data,{category:CATEGORIES.CONTACT, type:CATEGORIES.CONTACT.TYPES.PERSON})
  items = sort(items,["first","last"],SORTS.ASCENDING)
  items = project(items,["first","last","id"])

  let panel = <Panel grow>nothing selected</Panel>
  if(selected) {
    panel = <Panel grow>selected is {toString(selected,'first')} {toString(selected,'last')}</Panel>
    if(editing) {
      panel = <Panel grow>
        <label>first</label>
        <input type={"text"} value={toString(selected,'first')}/>
        <label>last</label>
        <input type={"text"} value={toString(selected,'last')}/>
        <button onClick={()=>setEditing(false)}>save</button>
        <button onClick={()=>setEditing(false)}>cancel</button>
      </Panel>
    }
  }

  return <Window width={500} height={250} title={'contacts'}>
    <HBox grow>
      <ul className={'list'}>{items.map(o=>{
        return <li key={o.id} onClick={()=>setSelected(o)}
                   className={selected===o?"selected":""}
        >{toString(o,'first')} {toString(o,'last')}</li>
      })}</ul>
      <VBox grow>
        {panel}
        <button
            disabled={!selected}
            onClick={()=>setEditing(!editing)}>edit</button>
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
      return <li key={o.id}>{toString(o,'first')}
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

  let panel = <Panel>nothing selected</Panel>
  if(selectedTask) {
    panel = <Panel>
      <p>{toString(selectedTask,'title')}</p>
      <b>{toString(selectedTask,'completed')}</b>
    </Panel>
  }

  return <Window width={400} height={300} x={200} y={300} title={'tasks'}>
    <HBox grow>
      <ul className={'list'}>{projects.map(o=> {
        return <li key={o.id}
                   onClick={()=>setSelected(o)}
                   className={selected===o?"selected":""}
        >{toString(o, 'title')}</li>
      })}</ul>
      <ul className={'list'}>{tasks.map(o=> {
        return <li key={o.id}
                   onClick={()=>setSelectedTask(o)}
                   className={selectedTask===o?"selected":""}
        >
          {toString(o, 'title')}
        </li>
      })}</ul>
      {panel}
    </HBox>
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
