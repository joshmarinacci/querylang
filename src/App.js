import React, {useEffect, useState} from 'react'
import './App.css'
import {ContactList} from './apps/contacts.js'
import {PeopleBar} from './apps/peoplebar.js'
import {TaskLists} from './apps/tasks.js'
import {Chat} from './apps/chat.js'
import {Calendar} from './apps/calendar.js'
import {Notes} from './apps/notes.js'
import {DBContext, makeDB} from './db.js'
import {AppBar} from './apps/AppBar.js'
import {Alarms} from './apps/alarms.js'
import {Email} from './apps/email.js'
import {Music} from './apps/music.js'
import {CATEGORIES} from './schema.js'
import {AppLauncherService, AppLauncherContext} from './services/AppLauncherService.js'
import {NotificationPanel} from './apps/NotificationPanel.js'
import {AND} from './query2.js'
import {AlarmContext, AlarmService} from './services/AlarmService.js'
import {DebugPanel} from './apps/debug.js'
import {CommandBar} from './apps/CommandBar.js'
import {PopupContainer, PopupManager, PopupManagerContext} from './ui/PopupManager.js'
import {MapViewer} from './apps/maps.js'
import {SettingsApp} from './apps/settings.js'
import {WriterApp} from './apps/writing.js'

import "./theme.css"
import {DataBrowser} from './apps/DataBrowser.js'
import {BookmarksManager} from './apps/bookmarks/bookmarks.js'
import {SystemBar} from './apps/systembar/systembar.js'
import {WindowManager, WindowManagerContext} from './ui/window.js'

let db_service = makeDB()
let app_launcher_service = new AppLauncherService()
let alarm_service = new AlarmService(db_service)
let pm = new PopupManager()
let wm = new WindowManager()

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
  /*

  Window wraps app
  <Window onRaise=callback app=app key=appid>
    <PeopleBar/>
  </Window>


start with a window context that wraps an increasing number
click raises the Z above the top one, and sets a new top one

   */

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
    if(appid === 'CommandBar') return <CommandBar key={appid} app={app} />
    if(appid === 'MapViewer') return <MapViewer key={appid} app={app}/>
    if(appid === 'SettingsApp') return <SettingsApp key={appid} app={app}/>
    if(appid === 'WriterApp') return <WriterApp key={appid} app={app}/>
    if(appid === 'DataBrowser') return <DataBrowser key={appid} app={app}/>
    if(appid === 'BookmarksManager') return <BookmarksManager key={appid} app={app}/>
    if(appid === 'SystemBar') return <SystemBar key={appid} app={app}/>
    console.error("no such app", appid)
    return <div>missing app</div>
  })

  return <div className={'os-background'}>
    <WindowManagerContext.Provider value={wm}>
    <DBContext.Provider value={db_service}>
      <AppLauncherContext.Provider value={app_launcher_service}>
        <AlarmContext.Provider value={alarm_service}>
          <PopupManagerContext.Provider value={pm}>
          <AppBar/>
          {ins}
          <PopupContainer/>
          </PopupManagerContext.Provider>
        </AlarmContext.Provider>
      </AppLauncherContext.Provider>
    </DBContext.Provider>
    </WindowManagerContext.Provider>
  </div>
}
export default App;
