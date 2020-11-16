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
import {Window, WindowManager, WindowManagerContext} from './ui/window.js'
import {FileBrowser, FileBrowserApp} from './ui/filebrowser.js'

let db_service = makeDB()
let app_launcher_service = new AppLauncherService()
let alarm_service = new AlarmService(db_service)
let pm = new PopupManager()
let wm = new WindowManager()

function App() {

  useEffect(()=>{
    let handle = (e)=>{
      if(e.key === ' ' && e.ctrlKey===true) {
        app_launcher_service.launchById('CommandBar',db_service)
      }
    }
    document.addEventListener('keypress',handle)
    return () => {
      document.removeEventListener('keypress',handle)
    }
  })

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

  function makeApp(app) {
    let appid = app.props.appid
    if(appid === 'PeopleBar') return <PeopleBar app={app}/>
    if(appid === 'NotificationPanel') return <NotificationPanel app={app} />
    if(appid === 'SystemBar') return <SystemBar app={app}/>

    if(appid === 'ContactList') return <ContactList app={app}/>
    if(appid === 'TaskLists') return <TaskLists app={app}/>
    if(appid === 'Chat') return <Chat app={app} />
    if(appid === 'Calendar') return <Calendar app={app} />
    if(appid === 'Notes') return <Notes app={app} />
    if(appid === 'Alarms') return <Alarms app={app} />
    if(appid === 'Email') return <Email app={app} />
    if(appid === 'Music') return <Music app={app} />
    if(appid === 'MapViewer') return <MapViewer app={app}/>
    if(appid === 'WriterApp') return <WriterApp app={app}/>
    if(appid === 'BookmarksManager') return <BookmarksManager app={app}/>
    if(appid === 'DebugPanel') return <DebugPanel app={app} />

    if(appid === 'CommandBar') return <CommandBar app={app} />
    if(appid === 'SettingsApp') return <SettingsApp app={app}/>
    if(appid === 'DataBrowser') return <DataBrowser app={app}/>
    if(appid === 'FileBrowserApp') return <FileBrowserApp app={app}/>

    return <div>app not found <b>{appid}</b></div>
  }

  let ins = apps.map((app,i) => {
    return <Window key={app.props.appid} app={app}>{makeApp(app)}</Window>
  })

  return <div className={'os-background'}>
    <WindowManagerContext.Provider value={wm}>
    <DBContext.Provider value={db_service}>
      <AppLauncherContext.Provider value={app_launcher_service}>
        <AlarmContext.Provider value={alarm_service}>
          <PopupManagerContext.Provider value={pm}>
            <BackgroundImage/>
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


function BackgroundImage({}) {
  return <div id={'background-image'}/>
}