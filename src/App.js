import React from 'react'
import './App.css'
import {CATEGORIES, DATA} from './schema.js'
import {ContactList} from './contacts.js'
import {PeopleBar} from './peoplebar.js'
import {TaskLists} from './tasks.js'
import {Chat} from './chat.js'
import {Calendar} from './calendar.js'
import {Notes} from './notes.js'


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
    <Notes data={DATA}/>
  </div>
}
export default App;
