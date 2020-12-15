/*
invokes actions for system wide commands
 */


import React from 'react'
import {AND, IS_CATEGORY, IS_PROP_SUBSTRING, IS_TYPE, OR} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import {propAsString} from '../db.js'
import * as chrono from 'chrono-node'
import {SCAN_SERVER_URL} from '../globals.js'
import {get_json_with_auth} from '../util.js'

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
            let furl = `${SCAN_SERVER_URL}?url=${action.url}`;
            return get_json_with_auth(furl).then(r => r.json()).then(d => {
                app_launcher.launchByIdWithArgs(db, 'PanelViewerApp',{
                    title:'scan results',
                    panel_func: 'WebpageScanResultsPanel',
                    info:{
                        action:action,
                        results:d,
                    },
                })
            })
        }
        if(action.service === 'EVENT_MAKER') {
            console.log("making event",action)
        }
        if(action.service === 'MUSIC_RUNNER') {
            console.log("playing music",action)
        }
        if(action.service === 'DICTIONARY_LOOKUP') {
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
            let api_key = 'fe5dd0b0a21045f0bdd235656201411'
            let url = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${'Eugene OR'}`
            fetch(url)
                .then(res => res.json())
                .catch(e => {
                    console.log("error",e)
                    return []
                })
                .then(d => {
                    app_launcher.launchByIdWithArgs(db,'PanelViewerApp',{
                        title:'weather',
                        panel_func: 'WeatherPanel',
                        info:d,
                    })
                })

        }
    }
}
export const ActionManagerContext = React.createContext('action-manager-dummy')


const APP_OPENER = {
    title:'AppOpener',
    command:'open',
    prefixMatch:(str) => {
        return "open".startsWith(str)
    },
    get_completions: (args, db) => {
        let apps = db.QUERY(AND(IS_CATEGORY(CATEGORIES.APP.ID), IS_TYPE(CATEGORIES.APP.TYPES.APP)))
        let name = args[1]
        name = name.toLowerCase()
        const name_match = (a => a.props.appid.toLowerCase().startsWith(name))
        return apps.filter(name_match).map(app => {
            return {
                text: args[0] + ' ' + app.props.appid,
                title: `Open ${app.props.title}`,
                action:true,
                service: 'APP_OPENER',
                appid: app.props.appid,
            }
        })
    }
}
const URL_SCANNER =     {
    title:'URLScanner',
    command:'scan',
    prefixMatch:(str) => {
        if("scan".startsWith(str)) return true
        if("https".startsWith(str.substring(0,5))) return true
        if("http".startsWith(str)) return true
        return false
    },
    get_completions: (args, db) => {
        if(args.length < 2) return []
        let val = args[1]
        if(val.startsWith('http')) {
            return [
                {
                    title: `Open in browser`,
                    action:true,
                    service:'URL_SCANNER',
                    command:'open',
                    url:val,
                },
                {
                    title:`scan URL`,
                    action:true,
                    service:'URL_SCANNER',
                    command:'scan',
                    url:val,
                },
            ]
        }
        return []
    }
}
const EMAIL_OPENER = {
    title:'EmailOpener',
    command:'email',
    prefixMatch:(str) => {
        return "email".startsWith(str)
    },
    get_completions: (args, db) => {
        if (args.length < 2) return []
        let val = args[1]
        let people = db.QUERY(AND(IS_CATEGORY(CATEGORIES.CONTACT.ID), IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON), IS_PROP_SUBSTRING('first',val)))
        return people.map((p)=>({
            text:`${args[0]} person`,
            title:`compose email to ${propAsString(p,'first')} ${propAsString(p,'last')}`,
            action:true,
            service: 'EMAIL_OPENER',
            person:p,
        }))
    }
}
const EVENT_MAKER = {
    title:'EventMaker',
    command: 'schedule',
    prefixMatch:str => {
        return 'schedule'.startsWith(str)
    },
    get_completions: (args, db) => {
        if (args.length < 2) return []
        let [first,...rest] = args
        // console.log("EVENT_MAKER rest is",rest.join(" "))
        let date = chrono.parseDate(rest.join(" "));
        // console.log("scanned",date)
        if(date) {
            return [
                {
                    text: 'schedule ',
                    title: `Schedule event at ${date}`,
                    action:true,
                    service: "EVENT_MAKER",
                }
            ]
        } else {
            return []
        }
    }
}
const MUSIC_RUNNER = {
    title:'MusicRunner',
    command:'play',
    prefixMatch:(str) => {
        return "play".startsWith(str)
    },
    get_completions: (args, db) => {
        if (args.length < 2) return []
        // console.log("MUSIC_RUNNER",args[1])
        let songs = db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.MUSIC.ID),
            IS_TYPE(CATEGORIES.MUSIC.TYPES.SONG),
            OR(
                IS_PROP_SUBSTRING('artist',args[1]),
                IS_PROP_SUBSTRING('title',args[1]),
                IS_PROP_SUBSTRING('album',args[1]),
            )))
        return songs.map(s => {
            return {
                text:`play ${args[1]}`,
                title:`Play ${propAsString(s,'title')} by ${propAsString(s,'artist')}`,
                action:true,
                service: 'MUSIC_RUNNER'
            }
        })
    }
}
const DICTIONARY_LOOKUP = {
    title:'DictionaryLookup',
    command:'lookup',
    prefixMatch: str => {
        return "lookup".startsWith(str)
    },
    get_completions: (args, db) => {
        if (args.length < 2) return []
        return [{
            text:`lookup ${args[1]}`,
            title:`lookup definition of ${args[1]}`,
            word: args[1],
            action:true,
            service:'DICTIONARY_LOOKUP',
        }]
    }
}
const FILE_SEARCHER = {
    title: 'FileSearcher',
    command:'file:',
    prefixMatch: str => {
        return 'file:'.startsWith(str)
    },
    get_completions: (args, db) => {
        if (args.length < 2) return []
        let q = args[1]
        if(q.trim() === '') return []
        let files = db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.FILES.ID),
            IS_TYPE(CATEGORIES.FILES.SCHEMAS.FILE_INFO.TYPE),
            OR(
                IS_PROP_SUBSTRING('filename',q),
                IS_PROP_SUBSTRING('url',q),
            )
        ))
        return files.map(f => ({
            text:`file: ${propAsString(f,'filename')}`,
            title:`view file ${propAsString(f,'filename')}`,
            action:true,
            service:'FILE_SEARCHER',
            fileid:f.id,
        }))
    }
}
const CALCULATOR_SERVICE = {
    title: 'CalculatorService',
    command:'calculate',
    prefixMatch:(str) => {
        if('calculate'.startsWith(str)) return true
        return str.match(/[0-9]/i)
    },
    get_completions: (args, db) => {
        if (args.length < 2) return []
        return [{
            text: args.join(" "),
            title:`${args.join(" ")} =`
        }]
    }
}
const WEATHER_FINDER = {
    title:'WeatherFinder',
    command:'weather',
    prefixMatch: str => {
        return 'weather'.startsWith(str)
    },
    get_completions: (args, db) => {
        return [
            {
                text:'weather',
                title:'get the weather',
                action:true,
                service:'WEATHER_FINDER'
            }
        ]
    }
}

export const COMMAND_SERVICES = [
    APP_OPENER,
    URL_SCANNER,
    EMAIL_OPENER,
    EVENT_MAKER,
    MUSIC_RUNNER,
    DICTIONARY_LOOKUP,
    FILE_SEARCHER,
    CALCULATOR_SERVICE,
    WEATHER_FINDER,
]


export function load_commandbar_plugins(db) {
    COMMAND_SERVICES.forEach(cmd => {
        let obj = db.make(CATEGORIES.APP.ID, CATEGORIES.APP.SCHEMAS.SEARCH_PLUGIN.TYPE)
        obj.props.plugin = cmd
        db.add(obj)
        obj.local = false
    })
}



