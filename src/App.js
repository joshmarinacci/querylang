import React, {useEffect, useState} from 'react'
import './App.css'
import {ContactList} from './contacts.js'
import {PeopleBar} from './peoplebar.js'
import {TaskLists} from './tasks.js'
import {Chat} from './chat.js'
import {Calendar} from './calendar.js'
import {Notes} from './notes.js'
import {makeDB} from './db.js'
import {AppBar} from './AppBar.js'
import {Alarms} from './alarms.js'
import {Email} from './email.js'
import {Music} from './music.js'

let db = makeDB()

class AppLauncherService {
  constructor() {
    this.running = []
    this.listeners = []
  }
  launch(app) {
    console.log("launching")
    this.running.push(app)
    this.listeners.forEach(l => l())
  }
  addEventListener(handler) {
    this.listeners.push(handler)
  }
  removeEventListener(handler) {
    this.listeners = this.listeners.filter(l => l !== handler)
  }
  close(app) {
    console.log("closing",app)
    this.running = this.running.filter(a => a.id !== app.id)
    this.listeners.forEach(l => l())
  }
}
let service = new AppLauncherService()

function App() {
  let [apps, setApps] = useState([])
  useEffect(()=>{
    let handler = () => {
      console.log("updating", service.running)
      setApps(service.running.slice())
    }
    service.addEventListener(handler)
    return () => service.removeEventListener(handler)
  })

  let ins = apps.map((app,i) => {
    let appid = app.props.appid
    // console.log("appid is",appid)
    if(appid === 'PeopleBar') return <PeopleBar app={app} key={appid} db={db} appService={service}/>
    if(appid === 'ContactList') return <ContactList app={app} key={appid} db={db} appService={service}/>
    if(appid === 'TaskLists') return <TaskLists key={appid} db={db} app={app} appService={service}/>
    if(appid === 'Chat') return <Chat key={appid} db={db} app={app} appService={service}/>
    if(appid === 'Calendar') return <Calendar key={appid} db={db} app={app} appService={service}/>
    if(appid === 'Notes') return <Notes key={appid} db={db} app={app} appService={service}/>
    if(appid === 'Alarms') return <Alarms key={appid} db={db} app={app} appService={service}/>
    if(appid === 'Email') return <Email key={appid} db={db} app={app} appService={service}/>
    if(appid === 'Music') return <Music key={appid} db={db} app={app} appService={service}/>
    return <div>missing app</div>
  })

  console.log("rendering",ins)
  return <div>
    <AppBar db={db} appService={service}/>
    {ins}
  </div>
}
export default App;
