import React from 'react';
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
  }
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
  return s.props[key]
}


function App() {
  return (<ContactList data={DATA}/>)
}

function ContactList({data}) {
  let items = query(data,{category:CATEGORIES.CONTACT, type:CATEGORIES.CONTACT.TYPES.PERSON})
  items = sort(items,["first","last"],SORTS.ASCENDING)
  items = project(items,["first","last","id"])
  return <ul>{items.map(o=>{
    return <li key={o.id}>{toString(o,'first')} {toString(o,'last')}</li>
  })}</ul>
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
