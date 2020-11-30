/*
invokes actions for system wide commands
 */


import React from 'react'

export class ActionManager {
    constructor() {
    }
    perform_action(action, db, app_launcher) {
        console.log("performing action",action)
        if(action.service === 'EMAIL_OPENER') {
            console.log("spawn compose panel with contact", action.person)
        }
        if(action.service === 'APP_OPENER') {
            app_launcher.launchById(action.appid,db)
            return
        }
        if(action.service === 'URL_SCANNER') {
            console.log("scanning",action)
        }
        if(action.service === 'EVENT_MAKER') {
            console.log("making event",action)
        }
        if(action.service === 'MUSIC_RUNNER') {
            console.log("playing music",action)
        }
        if(action.service === 'DICTONARY_LOOKUP') {
            console.log("looking up definition of",action.word)
            let url = `https://owlbot.info/api/v4/dictionary/${action.word}`
            fetch(url,{
                headers:{
                    'Authorization':'Token fb24b64c38943f5435dc51df0e6c9c9c45d9a95b',
                }
            }).then(res => res.json()).then(d => {
                console.log("got results",d)
                if(d.word) {
                    app_launcher.launchByIdWithArgs(db, 'PanelViewerApp', {
                        title: 'dictionary results',
                        panel_func: "DictionaryPanel",
                        info: d,
                    })
                } else {
                    console.log("no defintion! should show an error panel")
                }
            })
        }
        if(action.service === 'FILE_SEARCHER') {
            console.log("viewing file",action)
            app_launcher.launchByIdWithArgs(db, 'PanelViewerApp',{
                title:'viewing file',
                panel_func: 'ViewImagePanel',
                info:action,
            })
        }
        if(action.service === 'CALCULATOR_SERVICE') {
            console.log("calculating",action)
        }
        if(action.service === 'WEATHER_FINDER') {
            console.log("getting the weather",action)
        }
    }
}
export const ActionManagerContext = React.createContext('action-manager-dummy')
