// import * as chrono from 'chrono-node'


const assert = require('assert')
const wiki = require('wikijs').default;
const chrono = require('chrono-node');

/*

* AppOpener. Open. All app names.
* URL scanner: http https, then scan and open panel with options
* EmailRunner: email, query based on contacts names
* CalendarEventMaker: schedule, time phrase to parse, open scheduler panel
* MusicRunner: play then search music fields
* Lookup and look up, then search fir next word and open definition panel
* File: then a word to substring search. Should preload more files to search through. Opens file preview panel.
* CalculatorService, matches any numbers and operators. Produces value if valid expression. Opens calculation panel.
* WeatherFinder, matches “weather”. Opens weather panel
* PersonFinder, does realtime local search for people by first and last names

*/


const APP_NAMES = [
    "chat",
    "Calendar",
]

const PEOPLE = [
    {
        first:"Josh",
        last:"Marinacci",
        email:'josh@josh.earth',
    },
    {
        first: "Jesse",
        last:"Marinacci",
        email:'jesse@josh.earth',
    }
]

const MUSIC = {
    ARTISTS: [
        {
            name:'Beatles'
        },
        {
            name:'Beck',
        },
        {
            name:'Beach Boys'
        }
    ]
}

class OpenAppAction {
    constructor(name) {
        this.name = name
        this.title = `Open ${name}`
    }
}

class ScanURLAction {
    constructor(url) {
        this.url = url
        this.title = `Open ${url}`
    }

}

class OpenInboxAction{
    constructor() {
        this.title = 'Open Inbox'
    }
}

class ComposeEmailAction  {
    constructor(person) {
        this.person = person
        this.title = 'Compose New Email'
    }
    resolve_to_string() {
        return Promise.resolve({
            from:this.person.email
        })
    }
}

class OpenCalculatorPanelAction {
    constructor(args) {
        this.args = args
        this.title = `calculate ${args.join(" ")}`
    }
    resolve_to_string() {
        let a = parseInt(this.args[0])
        let op = this.args[1]
        let b = parseInt(this.args[2])

        if(op === '*') return a * b
        if(op === '+') return a + b
        return Number.MAX_VALUE
    }

}

class OpenMusicPlayerAction {
    constructor() {
        this.title = 'Open Music Player'
    }
}

class PlayMusicByArtistAction {
    constructor(a) {
        this.artist = a
        this.title = `Play music by ${a.name}`
    }

}

class OpenWeatherPanel {
    constructor(args) {
        this.title = 'Show Weather'
    }
}

class OpenFileBrowserAction {
    constructor(args) {
        this.title = `Search Files with query ${args}`
    }

}

class ScheduleMeetingAction {
    constructor(args) {
        this.to_parse = args
        this.title = `Create Event: ${args.join(" ")}`
    }
    resolve_to_string() {
        let ret = chrono.parseDate(this.to_parse.join(" "));
        return Promise.resolve(ret)
    }

}

class LookupWordAction {
    constructor(arg) {
        this.word = arg
        this.title = `Look up ${this.word}`
    }
    resolve_to_string() {
        return wiki().page(this.word).then(page => {
            this.page = page
            return page.summary()
        }).then(sum => {
            return sum.substring(0,50)
        });
    }

}

const services = [
    {
        title:'AppOpener',
        prefixMatch:(str) => {
            return "open".startsWith(str)
        },
        findActions: (args) => {
            return APP_NAMES.filter(a => a.toLowerCase().startsWith(args[0].toLowerCase()))
                .map(name => new OpenAppAction(name))
        }
    },
    {
        title:'URLScanner',
        prefixMatch:(str) => {
            if("scan".startsWith(str)) return true
            if("https".startsWith(str.substring(0,5))) return true
            if("http".startsWith(str)) return true
            return false
        },
        findActions:(args) => {
            let url = args[0]
            console.log('looking at url',url)
            return new ScanURLAction(url)
        }
    },
    {
        title:'EmailOpener',
        prefixMatch:(str) => {
            return "email".startsWith(str)
        },
        findActions: args => {
            let command = args[0]
            console.log("command is",command)
            if(!command || command.trim().length === 0) return [
                new OpenInboxAction(),
                new ComposeEmailAction(),
            ]
            console.log("doing a search on",command)
            return PEOPLE.filter(p => p.first.toLowerCase().startsWith(command.toLowerCase()) || p.last.toLowerCase().startsWith(command.toLowerCase())).map(p=>new ComposeEmailAction(p))
        }
    },
    {
        title:'EventMaker',
        prefixMatch:str => {
            return 'schedule'.startsWith(str)
        },
        findActions: args => {
            return new ScheduleMeetingAction(args)
        }
    },
    {
        title:'MusicRunner',
        prefixMatch:(str) => {
            return "play".startsWith(str)
        },
        findActions:args => {
            console.log("music runner with",args)
            if(args.length === 0) return new OpenMusicPlayerAction()
            let q = args[0].toLowerCase()
            return MUSIC.ARTISTS.filter(a => a.name.toLowerCase().startsWith(q))
                .map(a => new PlayMusicByArtistAction(a))
        }
    },
    {
        title:'DictionaryLookup',
        prefixMatch: str => {
            return "lookup".startsWith(str)
        },
        findActions: args => {
            console.log('dictonary args',args)
            return new LookupWordAction(args[0])
        }
    },
    {
        title: 'FileSearcher',
        prefixMatch: str => {
            return 'file:'.startsWith(str)
        },
        findActions: args => {
            return new OpenFileBrowserAction(args)
        }
    },
    {
        title: 'CalculatorService',
        prefixMatch:(str) => {
            if('calculate'.startsWith(str)) return true
            return str.match(/[0-9]/i)
        },
        findActions: args => {
            return new OpenCalculatorPanelAction(args)
        }
    },
    {
        title:'WeatherFinder',
        prefixMatch: str => {
            return 'weather'.startsWith(str)
        },
        findActions: args => {
            return new OpenWeatherPanel(args)
        }
    },
    // {
    //     title:'PersonFinder',
    //     prefixMatch: str => {
    //         return true
    //     }
    // }

];


function eq(value, answer, msg) {
    if(value !== answer)throw new Error(`${value} was supposed to be ${answer}. ${msg}`)
}

function startCompletions(str, services) {
    // console.log(`searching for services that can do something with "${str}"`)
    return services.filter(s => {
        // console.log('checking',s)
        if(s.prefixMatch) {
            return s.prefixMatch(str)
        }
        return false
    })
}

function findActions(str) {
    console.log(`===== ${str}`)
    let args = str.split(" ")
    let svcs = startCompletions(args[0],services)
    // console.log(`finding actions for "${str}" => "${args[0]}"`)
    // console.log("found the services",svcs)
    let rest = args.slice(1)
    let actions = svcs.map(s => {
        // console.log('checking with service',s)
        if(s.findActions) return s.findActions(rest)
        return []
    }).flat()
    console.log('actions are',actions)
    return actions
}

function test_actions() {
    // op should complete to open from AppOpener
    eq(startCompletions('op',services).length,1)
    // open should complete to open from AppOpener then suggest a space
    eq(startCompletions('open',services).length,1)

    // 'open c' should suggest actions to open all apps that start with 'c' which is calendar and chat
    eq(findActions('open c').length,2,'open two apps starting with c')
    eq(findActions('open chat').length,1,'action to open chat app')

    // `ht` should match URL scanner
    eq(startCompletions('ht',services).length,1, 'http')
    // http should match but not suggest completions from URLScanner
    eq(startCompletions('http',services).length,1, 'http')
    // https://www.google.com/ should match URL scanner, result offers to scan it
    eq(startCompletions('https://www.google.com/',services).length,1, 'google')
    eq(findActions("scan https://www.google.com/").length,1,'google')


    // `email` should just match Email Runner which then can offer actions
    eq(startCompletions('email',services).length,1)
    // 'email' should return actions for read email and compose new email
    eq(findActions('email').length,2,'email actions')


    // 4 should match Calculator, shows result of 'Calc 4 = 4'
    eq(startCompletions('4',services).length,1, 'calc 4')
    // 4* should match Calculator, doesn't suggest a result
    eq(startCompletions('4*',services).length,1)
    // 4*5 should match Calculator, shows result of 'Calc 4*5 = 20'
    eq(startCompletions('4*5',services).length,1)
    // calculate 4*5 should return an action with the result of 4*5 as the title, and open the calc panel
    eq(findActions('calculate 4*5').length,1,' open calculator')




    // 'email' should match only email app. offers actions of new and read
    eq(startCompletions('email',services)[0].title,'EmailOpener','just start email')
    // 'email j' should show actions for composing email to everyone who's name begins with 'j'.
    eq(findActions('email j').length,2)

    // `pla` should match MusicRunner
    eq(startCompletions('pla',services)[0].title, 'MusicRunner','music runner')

    // 'play' should match music runner and return action to open music player
    eq(findActions('play').length,1)
    // 'play be' should match music runner and return actions to play music by artists that start with be (beatles and beach boys and beck)
    eq(findActions('play be').length,3)
    // `play beatles` should match music runner playing the beatles
    eq(findActions('play beatles').length,1)

    // `weath` should match the weather app
    eq(startCompletions('weath',services)[0].title,'WeatherFinder','weather test')
    // `weather` should match the weather app and return action to open weather panel
    eq(findActions('weather').length,1)

    // `file` should match the file searcher app
    eq(startCompletions('file',services)[0].title,'FileSearcher','launch file app')
    // `file:` should match the file searcher app
    eq(findActions('file:').length,1)
    // 'file: flowers'  should return a query for searching for flowers in all known files
    eq(findActions('file: flowers').length,1)


    // 'sched' should match the event scheduler app
    eq(startCompletions('sched',services)[0].title,'EventMaker','start event maker')
    // 'schedule meeting tomorrow at 5am' should suggest create a meeting with calculated next day of 5am
    eq(findActions('schedule meeting tomorrow at 5am').length,1)


    // 'look' should match the dictionary app
    eq(startCompletions('look',services)[0].title,'DictionaryLookup','launch dictionary')
    // 'lookup acorn' should match dictonary app and return action that searches for acorn
    eq(findActions('lookup acorn').length,1)




    // 'jo' should search for people who's name starts with 'jo', case-insensitive, with action to open each result in contact panel
    // eq(startCompletions('jo',services)[0].title,'PeopleFinder','recognize the people finder')
}

test_actions()

function resolve(str) {
    let actions = findActions(str)
    console.log("got actions",actions)
    return actions[0].resolve_to_string()
}

function eq_resolve(str, answer, msg) {
    resolve(str).then(ret => {
        console.log("promise returned",ret)
        console.log("comparing to ans",answer)
        assert.deepStrictEqual(ret,answer)
    })
}

function test_execution() {
    eq_resolve('schedule meeting tomorrow at 5am', new Date(2020,10,29,5))
    eq_resolve('email josh',{from:"josh@josh.earth"})
    //
    // eq(resolve('calculate 4 * 5'),20)
    // eq(resolve('calculate 4 + 5'),9)
    //
    eq_resolve('lookup acorn',"The acorn, or oaknut, is the nut of the oaks and t")
}

test_execution()