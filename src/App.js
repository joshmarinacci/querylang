import React, {useEffect, useState} from 'react'
import './App.css'
import {ContactList} from './contacts.js'
import {PeopleBar} from './peoplebar.js'
import {TaskLists} from './tasks.js'
import {Chat} from './chat.js'
import {Calendar} from './calendar.js'
import {Notes} from './notes.js'
import {DBContext, makeDB} from './db.js'
import {AppBar} from './AppBar.js'
import {Alarms} from './alarms.js'
import {Email} from './email.js'
import {Music} from './music.js'
import {CATEGORIES} from './schema.js'
import {AppLauncherService, AppLauncherContext} from './services/AppLauncherService.js'
import {NotificationPanel} from './NotificationPanel.js'
import {AND} from './query2.js'

let db_service = makeDB()
let app_launcher_service = new AppLauncherService()

function App() {
  useEffect(()=>{
    let handler = () => setApps(app_launcher_service.running.slice())
    app_launcher_service.addEventListener(handler)
    return () => app_launcher_service.removeEventListener(handler)
  })

  let [apps, setApps] = useState(()=>{
    let apps = db_service.QUERY(AND(
        {CATEGORY:CATEGORIES.APP.ID},
            {TYPE:CATEGORIES.APP.TYPES.APP},
            {equal: {prop:'preload', value:true}}
      ))
    apps.forEach(app => app_launcher_service.launch(app))
    return apps
  })

  let ins = apps.map((app,i) => {
    let appid = app.props.appid
    // console.log("appid is",appid)
    if(appid === 'PeopleBar') return <PeopleBar app={app} key={appid}/>
    if(appid === 'ContactList') return <ContactList app={app} key={appid} db={db_service} appService={app_launcher_service}/>
    if(appid === 'TaskLists') return <TaskLists key={appid} db={db_service} app={app} appService={app_launcher_service}/>
    if(appid === 'Chat') return <Chat key={appid} db={db_service} app={app} appService={app_launcher_service}/>
    if(appid === 'Calendar') return <Calendar key={appid} db={db_service} app={app} appService={app_launcher_service}/>
    if(appid === 'Notes') return <Notes key={appid} db={db_service} app={app} appService={app_launcher_service}/>
    if(appid === 'Alarms') return <Alarms key={appid} db={db_service} app={app} appService={app_launcher_service}/>
    if(appid === 'Email') return <Email key={appid} db={db_service} app={app} appService={app_launcher_service}/>
    if(appid === 'Music') return <Music key={appid} db={db_service} app={app} appService={app_launcher_service}/>
    if(appid === 'NotificationPanel') return <NotificationPanel key={appid} db={db_service} app={app} appService={app_launcher_service}/>
    return <div>missing app</div>
  })

  return <div>
    <DBContext.Provider value={db_service}>
      <AppLauncherContext.Provider value={app_launcher_service}>
        <AppBar/>
        {ins}
      </AppLauncherContext.Provider>
    </DBContext.Provider>
  </div>
}
export default App;
