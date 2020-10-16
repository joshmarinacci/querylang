import React from 'react'
import './App.css'
import {ContactList} from './contacts.js'
import {PeopleBar} from './peoplebar.js'
import {TaskLists} from './tasks.js'
import {Chat} from './chat.js'
import {Calendar} from './calendar.js'
import {Notes} from './notes.js'
import {makeDB} from './db.js'

let db = makeDB()

function App() {
  return <div>
    <ContactList db={db}/>
    <PeopleBar db={db}/>
    <TaskLists db={db}/>
    <Chat db={db}/>
    <Calendar db={db}/>
    <Notes db={db}/>
  </div>
}
export default App;
