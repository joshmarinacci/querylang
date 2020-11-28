import React, {useContext} from "react"
import "./commandbar3.css"
import {DBContext} from '../db.js'
import {AND, IS_CATEGORY, IS_TYPE} from '../query2.js'
import {CATEGORIES} from '../schema.js'

const APP_NAMES = [
    "chat",
    "Calendar",
]

// class OpenAppAction {
//     constructor(name) {
//         this.name = name
//         this.title = `Open ${name}`
//     }
// }

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
        console.log("scanning args",args)
        let apps = db.QUERY(AND(IS_CATEGORY(CATEGORIES.APP.ID), IS_TYPE(CATEGORIES.APP.TYPES.APP)))
        let name = args[1]
        name = name.toLowerCase()
        const name_match = (a => a.props.appid.toLowerCase().startsWith(name))
        return apps.filter(name_match).map(app => {
            return {
                text: args[0] + ' ' + app.props.appid,
                title: `Open ${app.props.title}`
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
    findActions:(args) => {
        // let url = args[0]
        // console.log('looking at url',url)
        // return new ScanURLAction(url)
    }
}
const EMAIL_OPENER = {
    title:'EmailOpener',
    command:'email',
    prefixMatch:(str) => {
        return "email".startsWith(str)
    },
    findActions: args => {
        let command = args[0]
        console.log("command is",command)
        if(!command || command.trim().length === 0) return [
            // new OpenInboxAction(),
            // new ComposeEmailAction(),
        ]
        console.log("doing a search on",command)
        // return PEOPLE.filter(p => p.first.toLowerCase().startsWith(command.toLowerCase()) || p.last.toLowerCase().startsWith(command.toLowerCase())).map(p=>new ComposeEmailAction(p))
    }
}
const EVENT_MAKER = {
    title:'EventMaker',
    command: 'schedule',
    prefixMatch:str => {
        return 'schedule'.startsWith(str)
    },
    findActions: args => {
        // return new ScheduleMeetingAction(args)
    }
}
const MUSIC_RUNNER = {
    title:'MusicRunner',
    command:'play',
    prefixMatch:(str) => {
        return "play".startsWith(str)
    },
    findActions:args => {
        console.log("music runner with",args)
        // if(args.length === 0) return new OpenMusicPlayerAction()
        let q = args[0].toLowerCase()
        // return MUSIC.ARTISTS.filter(a => a.name.toLowerCase().startsWith(q))
        //     .map(a => new PlayMusicByArtistAction(a))
    }
}
const DICTONARY_LOOKUP = {
    title:'DictionaryLookup',
    command:'lookup',
    prefixMatch: str => {
        return "lookup".startsWith(str)
    },
    findActions: args => {
        console.log('dictonary args',args)
//    return new LookupWordAction(args[0])
    }
}
const FILE_SEARCHER = {
    title: 'FileSearcher',
    command:'file:',
    prefixMatch: str => {
        return 'file:'.startsWith(str)
    },
    findActions: args => {
        // return new OpenFileBrowserAction(args)
    }
}
const CALCULATOR_SERVICE = {
    title: 'CalculatorService',
    command:'calculate',
    prefixMatch:(str) => {
        if('calculate'.startsWith(str)) return true
        return str.match(/[0-9]/i)
    },
    findActions: args => {
//    return new OpenCalculatorPanelAction(args)
    }
}
const WEATHER_FINDER = {
    title:'WeatherFinder',
    command:'weather',
    prefixMatch: str => {
        return 'weather'.startsWith(str)
    },
    findActions: args => {
        // return new OpenWeatherPanel(args)
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
    let apps = db.QUERY(AND(IS_CATEGORY(CATEGORIES.APP.ID), IS_TYPE(CATEGORIES.APP.TYPES.APP)))
    // console.log("apps",apps)
    let args = code.split(" ")
    console.log("=== searching for results to",args)
    let list = []
    COMMAND_SERVICES.forEach(svc => {
        // console.log('checking',svc)
        if(svc.prefixMatch(args[0])) {
            console.log("matched", svc.title)
            if(args.length > 1) {
                console.log('more args',args)
                let res = svc.get_completions(args, db);//.forEach(it => list.push(it))
                res.forEach(it => list.push(it))
                console.log("results",res)
            } else {
                list.push({
                    text: svc.command + " ",
                    title: svc.command + " "
                })
            }
        }
    })

    return list
}

export function CommandBar3() {
    const [code, setCode] = React.useState("");
    let db = useContext(DBContext)
    let results = find_results(code,db)

    function detect_enter(e) {
        if(e.key === 'Enter') {
            console.log("pressed enter")
            setCode("")
        }
    }

    return (
        <div className={'commandbar'}>
            <input type={'text'} value={code} onChange={e => setCode(e.target.value)}
                   onKeyDown={e => detect_enter(e)}
            />
            <ul className={'results'}>
                {results.map((r,i) => <li key={i}>{r.title}</li>)}
            </ul>
        </div>
    );
}
