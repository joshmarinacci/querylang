import React from 'react'
import './App.css'
import {CATEGORIES, DATA} from './schema.js'
import {ContactList} from './contacts.js'
import {PeopleBar} from './peoplebar.js'
import {TaskLists} from './tasks.js'
import {Chat} from './chat.js'
import {Calendar} from './calendar.js'
import {Notes} from './notes.js'

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
