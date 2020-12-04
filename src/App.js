import React, {useContext, useEffect, useState} from 'react'
import './App.css'
import "./ui/themetester.css"
import {ContactList} from './apps/contacts.js'
import {PeopleBar} from './apps/peoplebar.js'
import {TaskLists} from './apps/tasks.js'
import {Chat} from './apps/chat.js'
import {Calendar} from './apps/calendar.js'
import {Notes} from './apps/notes.js'
import {DBContext, makeDB, propAsString, setProp} from './db.js'
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
import {PopupContainer, PopupManager, PopupManagerContext} from './ui/PopupManager.js'
import {MapViewer} from './apps/maps.js'
import {SettingsApp} from './apps/settings.js'
import {WriterApp} from './apps/writing.js'

// import "./theme.css"
import {DataBrowser} from './apps/DataBrowser.js'
import {BookmarksManager} from './apps/bookmarks/bookmarks.js'
import {SystemBar} from './apps/systembar/systembar.js'
import {Window, WindowManager, WindowManagerContext} from './ui/window.js'
import {FileBrowserApp} from './ui/filebrowser.js'
import {IFrameApp} from './apps/IframeApp.js'
import {NewsReader} from './apps/NewsReader.js'
import {DialogContainer, DialogManager, DialogManagerContext} from './ui/DialogManager.js'
import {PodcastPlayer} from './apps/PodcastPlayer.js'
import {CommandBar3} from './apps/CommandBar3.js'
import {ActionManager, ActionManagerContext, load_commandbar_plugins} from './services/ActionManager.js'
import {PanelViewerApp} from './apps/PanelViewerApp.js'
import {check_services, get_json_with_auth} from './util.js'
import {PERSIST_SERVER_URL} from './globals.js'

let db_service = makeDB()
let app_launcher_service = new AppLauncherService()
let alarm_service = new AlarmService(db_service)
let pm = new PopupManager()
let am = new ActionManager()
let wm = new WindowManager()
load_commandbar_plugins(db_service)


const APP_REGISTRY = {
  // system apps
  AppBar, CommandBar3, DebugPanel, NotificationPanel,
  PanelViewerApp, PeopleBar,  SystemBar,  SettingsApp,


  // user apps
  Alarms,  BookmarksManager, Calendar,  Chat, ContactList, DataBrowser, Email,
  FileBrowserApp, IFrameApp,
  MapViewer, Music, NewsReader, Notes, PodcastPlayer,
  TaskLists, WriterApp,
}


function load_remote_data() {
    check_services()
        .then(d=>{
          console.log("services loaded",d)
          return get_json_with_auth(PERSIST_SERVER_URL+'/load/myjson').then(r => r.json()).then(r => {
            console.log('response from persist is',r)
            db_service.nuke_and_reload_from_plainobject(r.data)
            load_commandbar_plugins(db_service)
          })
        })
        .catch(e => {
          console.log("services not available",e)
          let alert = db_service.make(CATEGORIES.NOTIFICATION.ID, CATEGORIES.NOTIFICATION.TYPES.ALERT)
          setProp(alert,'title','services not available')
          db_service.add(alert)
        })
}

function preload_apps() {
    // console.log("preloading apps")
    db_service.QUERY(AND(
        {CATEGORY:CATEGORIES.APP.ID},
        {TYPE:CATEGORIES.APP.TYPES.APP},
        {equal: {prop:'preload', value:true}}
    )).forEach(app => {
      // console.log("preloading ",propAsString(app,'appid'))
      app_launcher_service.launch(app)
    })
}

setTimeout(preload_apps,1000)
setTimeout(load_remote_data,2000)

function App() {
  let [apps, setApps] = useState([])

  useEffect(()=>{
    let handle = (e)=>{
      if(e.key === ' ' && e.ctrlKey===true) {
        app_launcher_service.launchById('CommandBar3',db_service)
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

  function makeApp(ai) {
    let appid = ai.app.props.appid
    if(APP_REGISTRY[appid]) {
      let TheApp = APP_REGISTRY[appid]
      return <TheApp instance={ai} app={ai.app}/>
    }
    return <div>app not found <b>{appid}</b></div>
  }

  let app_instances = apps.map((ai,i) => {
    let dm = new DialogManager()
    return <Window key={ai.id} instance={ai}>
      <DialogManagerContext.Provider value={dm}>
        {makeApp(ai)}
        <DialogContainer/>
      </DialogManagerContext.Provider>
    </Window>
  })

  return <div className={'os-background'}>
    <WindowManagerContext.Provider value={wm}>
    <DBContext.Provider value={db_service}>
      <AppLauncherContext.Provider value={app_launcher_service}>
        <AlarmContext.Provider value={alarm_service}>
          <PopupManagerContext.Provider value={pm}>
            <ActionManagerContext.Provider value={am}>
              <BackgroundImage/>
                {app_instances}
              <PopupContainer/>
            </ActionManagerContext.Provider>
          </PopupManagerContext.Provider>
        </AlarmContext.Provider>
      </AppLauncherContext.Provider>
    </DBContext.Provider>
    </WindowManagerContext.Provider>
  </div>
}
export default App;


function BackgroundImage({}) {
  let db = useContext(DBContext)
  return <div id={'background-image'} onContextMenu={(e)=>{
    e.preventDefault()
    app_launcher_service.launchById("DebugPanel",db)
  }}/>
}