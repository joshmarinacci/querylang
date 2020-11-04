import React, {useEffect, useState} from 'react'
import './App.css'
import {ContactList} from './apps/contacts.js'
import {PeopleBar} from './peoplebar.js'
import {TaskLists} from './apps/tasks.js'
import {Chat} from './apps/chat.js'
import {Calendar} from './apps/calendar.js'
import {Notes} from './apps/notes.js'
import {DBContext, makeDB} from './db.js'
import {AppBar} from './AppBar.js'
import {Alarms} from './apps/alarms.js'
import {Email} from './apps/email.js'
import {Music} from './apps/music.js'
import {CATEGORIES} from './schema.js'
import {AppLauncherService, AppLauncherContext} from './services/AppLauncherService.js'
import {NotificationPanel} from './NotificationPanel.js'
import {AND} from './query2.js'
import {AlarmContext, AlarmService} from './services/AlarmService.js'
import {DebugPanel} from './debug.js'

let db_service = makeDB()
let app_launcher_service = new AppLauncherService()
let alarm_service = new AlarmService(db_service)

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
    if(appid === 'ContactList') return <ContactList app={app} key={appid}/>
    if(appid === 'TaskLists') return <TaskLists key={appid} app={app} />
    if(appid === 'Chat') return <Chat key={appid} app={app} />
    if(appid === 'Calendar') return <Calendar key={appid} app={app} />
    if(appid === 'Notes') return <Notes key={appid} app={app} />
    if(appid === 'Alarms') return <Alarms key={appid} app={app} />
    if(appid === 'Email') return <Email key={appid} app={app} />
    if(appid === 'Music') return <Music key={appid} app={app} />
    if(appid === 'NotificationPanel') return <NotificationPanel key={appid} app={app} />
    if(appid === 'DebugPanel') return <DebugPanel key={appid} app={app} />
    return <div>missing app</div>
  })

  return <div>
    <DBContext.Provider value={db_service}>
      <AppLauncherContext.Provider value={app_launcher_service}>
        <AlarmContext.Provider value={alarm_service}>
          <AppBar/>
          {ins}
        </AlarmContext.Provider>
      </AppLauncherContext.Provider>
    </DBContext.Provider>
  </div>
}
export default App;
