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
import {CATEGORIES} from './schema.js'
import {AppLauncherService} from './services/AppLauncherService.js'
import {NotificationPanel} from './NotificationPanel.js'
import {AND} from './query2.js'

let db = makeDB()

let service = new AppLauncherService()

function App() {
  useEffect(()=>{
    let handler = () => setApps(service.running.slice())
    service.addEventListener(handler)
    return () => service.removeEventListener(handler)
  })

  let [apps, setApps] = useState(()=>{
    let apps = db.QUERY(AND(
        {CATEGORY:CATEGORIES.APP.ID},
            {TYPE:CATEGORIES.APP.TYPES.APP},
            {equal: {prop:'preload', value:true}}
      ))
    apps.forEach(app => service.launch(app))
    return apps
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
    if(appid === 'NotificationPanel') return <NotificationPanel key={appid} db={db} app={app} appService={service}/>
    return <div>missing app</div>
  })

  return <div>
    <AppBar db={db} appService={service}/>
    {ins}
  </div>
}
export default App;
