import React, {useState} from 'react'
import './App.css';

const CATEGORIES = {
  CONTACT:{
    ID:'CONTACT',
    TYPES:{
      PERSON:'PERSON'
    }
  },
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
      ]
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
    }
  },
  {
    id:3,
    category: CATEGORIES.CONTACT.ID,
    type:CATEGORIES.CONTACT.TYPES.PERSON,
    props: {
      first:'Cocoa',
    }
  },
  {
    id:4,
    category: CATEGORIES.CONTACT.ID,
    type:CATEGORIES.CONTACT.TYPES.PERSON,
    props: {
      first:'Oreo',
    }
  },

]

const SORTS = {
  ASCENDING:"ASCENDING",
}


function query(data,opts) {
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
  return s.props[key]
}


function App() {
  return (<ContactList data={DATA}/>)
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
function Window({width,height,children}) {
  let style = {
    width: width ? (width + "px") : "100px",
    height: height ? (height + "px") : "100px",
  }
  return <div className={"window"} style={style}>{children}</div>
}

function ContactList({data}) {
  const [selected, setSelected] = useState(null)
  const [editing, setEditing] = useState(false)


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

  return <Window width={500} height={400}>
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

function DataDumpPanel({data}) {
  return <ul>
    {data.map(o => {
      return <li>{o.category}</li>
    })}
  </ul>
  return <div>some data</div>
}
export default App;
