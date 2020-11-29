import React, {useContext, useState} from "react"
import "./commandbar3.css"
import {DBContext, propAsString} from '../db.js'
import {AND, IS_CATEGORY, IS_PROP_SUBSTRING, IS_TYPE, OR} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import * as chrono from 'chrono-node'
import {flatten} from '../util.js'
import {ActionManagerContext} from '../services/ActionManager.js'
import {AppLauncherContext} from '../services/AppLauncherService.js'

const APP_NAMES = [
    "chat",
    "Calendar",
]

const APP_OPENER = {
    title:'AppOpener',
    command:'open',
    prefixMatch:(str) => {
        return "open".startsWith(str)
    },
    findActions: (args) => {
        // return APP_NAMES.filter(a => a.toLowerCase().startsWith(args[0].toLowerCase()))
        //     .map(name => new OpenAppAction(name))
    },
    get_completions: (args, db) => {
        // console.log("scanning args",args)
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
                    title:`scan for news feed (RSS)`,
                    action:true,
                    service:'URL_SCANNER',
                    command:'scan_news',
                    url:val,
                },
                {
                    title:`check as image`,
                    action:true,
                    service:'URL_SCANNER',
                    command:'scan_image',
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
const DICTONARY_LOOKUP = {
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
            action:true,
            service:'DICTONARY_LOOKUP',
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
        let files = db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.FILES.ID),
            IS_TYPE(CATEGORIES.FILES.SCHEMAS.FILE_INFO),
            OR(
                IS_PROP_SUBSTRING('filename',args[1]),
                IS_PROP_SUBSTRING('url',args[1]),
            )))
        return files.map(f => ({
            text:'file: ',
            title:`view file ${args[1]}`
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
                title:'get the weather'
            }
        ]
    }
}

const COMMAND_SERVICES = [
    APP_OPENER,
    URL_SCANNER,
    EMAIL_OPENER,
    EVENT_MAKER,
    MUSIC_RUNNER,
    DICTONARY_LOOKUP,
    FILE_SEARCHER,
    CALCULATOR_SERVICE,
    WEATHER_FINDER,
]


function find_results(code, db) {
    let args = code.split(" ")
    if(args[0] === '') return []
    // console.log("=== searching for results to",args)
    let list = []
    COMMAND_SERVICES.forEach(svc => {
        // console.log('checking',svc)
        if(svc.prefixMatch(args[0])) {
            // console.log("matched", svc.title)
            if(args.length > 1) {
                // console.log('more args',args)
                let res = svc.get_completions(args, db);//.forEach(it => list.push(it))
                res.forEach(it => list.push(it))
                // console.log("results",res)
            } else {
                list.push({
                    text: svc.command + " ",
                    title: svc.title
                })
            }
        }
    })

    return list
}


export function CommandBar3() {
    const [code, setCode] = useState("");
    let db = useContext(DBContext)
    let results = find_results(code,db)
    let [selected, setSelected] = useState(-1)
    let am = useContext(ActionManagerContext)
    let app_launcher = useContext(AppLauncherContext)

    function handle_keys(e) {
        if(selected > results.length) {
            setSelected(results.length -1)
        }
        if(e.key === 'ArrowDown') {
            e.preventDefault()
            if(selected+1 < results.length) {
                setSelected(selected+1)
            }
        }
        if(e.key === 'ArrowUp') {
            e.preventDefault()
            if(selected>0) {
                setSelected(selected-1)
            }
        }
        if(e.key === 'Enter') {
            if(selected>=0) {
                let sel = results[selected]
                if(sel.action) {
                    am.perform_action(sel,db,app_launcher)
                    setCode("")
                } else {
                    setCode(sel.text)
                }
            } else {
                setCode("")
            }
        }
    }

    return (
        <div className={'commandbar'}>
            <input type={'text'} value={code} onChange={e => setCode(e.target.value)}
                   onKeyDown={e => handle_keys(e)}
            />
            <ul className={'results'}>
                {results.map((r,i) => {
                    let clss = {
                        result:true,
                        selected:(i === selected)
                    }
                    return <li key={i} className={flatten(clss)}>{r.title}</li>
                })}
            </ul>
        </div>
    );
}
