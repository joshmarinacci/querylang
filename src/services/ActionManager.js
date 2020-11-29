/*
invokes actions for system wide commands
 */


import React from 'react'

export class ActionManager {
    constructor() {
    }
    perform_action(sel) {
        console.log("performing action",sel)
        if(sel.service === 'EMAIL_OPENER') {
            console.log("spawn compose panel with contact", sel.person)
        }
        if(sel.service === 'APP_OPENER') {
            console.log("launching app with id",sel.appid)
        }
        if(sel.service === 'URL_SCANNER') {
            console.log("scanning",sel)
        }
        if(sel.service === 'EVENT_MAKER') {
            console.log("making event",sel)
        }
        if(sel.service === 'MUSIC_RUNNER') {
            console.log("playing music",sel)
        }
        if(sel.service === 'DICTONARY_LOOKUP') {
            console.log("looking up definition of",sel)
        }
        if(sel.service === 'FILE_SEARCHER') {
            console.log("viewing file",sel)
        }
        if(sel.service === 'CALCULATOR_SERVICE') {
            console.log("calculating",sel)
        }
        if(sel.service === 'WEATHER_FINDER') {
            console.log("getting the weather",sel)
        }
    }
}
export const ActionManagerContext = React.createContext('action-manager-dummy')
