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

const services = [
    {
        title:'AppOpener',
        prefixMatch:(str) => {
            return "open".startsWith(str)
        }
    },
    {
        title:'URLScanner',
        prefixMatch:(str) => {
            if("https".startsWith(str.substring(0,5))) return true
            if("http".startsWith(str)) return true
            return false
        }
    },
    {
        title:'EmailOpener',
        prefixMatch:(str) => {
            return "email".startsWith(str)
        }
    },
    {
        title:'EventMaker',
        prefixMatch:str => {
            return 'schedule'.startsWith(str)
        }
    },
    {
        title:'MusicRunner',
        prefixMatch:(str) => {
            return "play".startsWith(str)
        }
    },
    {
        title:'DictionaryLookup',
        prefixMatch: str => {
            return "lookup".startsWith(str)
        }
    },
    {
        title: 'FileSearcher',
        prefixMatch: str => {
            return 'file:'.startsWith(str)
        }
    },
    {
        title: 'CalculatorService',
        prefixMatch:(str) => {
            return str.match(/[0-9]/i)
        }
    },
    {
        title:'WeatherFinder',
        prefixMatch: str => {
            return 'weather'.startsWith(str)
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
    console.log(`searching for services that can do something with "${str}"`)
    return services.filter(s => {
        // console.log('checking',s)
        if(s.prefixMatch) {
            return s.prefixMatch(str)
        }
        return false
    })
}

function test1() {
    // op should complete to open from AppOpener
    eq(startCompletions('op',services).length,1)
    // open should complete to open from AppOpener then suggest a space
    eq(startCompletions('open',services).length,1)
    // `ht` should match URL scanner
    eq(startCompletions('ht',services).length,1, 'http')
    // http should match but not suggest completions from URLScanner
    eq(startCompletions('http',services).length,1, 'http')
    // https://www.google.com/ should match URL scanner, result offers to scan it
    eq(startCompletions('https://www.google.com/',services).length,1, 'google')
    // `email` should just match Email Runner which then can offer actions
    eq(startCompletions('email',services).length,1)

    // 4 should match Calculator, shows result of 'Calc 4 = 4'
    eq(startCompletions('4',services).length,1, 'calc 4')
    // 4* should match Calculator, doesn't suggest a result
    eq(startCompletions('4*',services).length,1)
    // 4*5 should match Calculator, shows result of 'Calc 4*5 = 20'
    eq(startCompletions('4*5',services).length,1)




    // email should match only email app. offers actions of new and read
    eq(startCompletions('email',services)[0].title,'EmailOpener','just start email')
    // email jos, email app already accepted, now starts searching for names in contacts

    // `pla` should match MusicRunner
    eq(startCompletions('pla',services)[0].title, 'MusicRunner','music runner')

    // `play beatles` should match music runner playing the beatles
    // 'play be' should match music runner and return actions to play music by artists that start with be (beatles and beach boys and beck)
    // 'play' should match music runner and return action to open music player

    // `weath` should match the weather app
    eq(startCompletions('weath',services)[0].title,'WeatherFinder','weather test')
    // `weather` should match the weather app and return action to open weather panel

    // `file` should match the file searcher app
    eq(startCompletions('file',services)[0].title,'FileSearcher','launch file app')
    // `file:` should match the file searcher app
    // 'file: flowers'  should return a query for searching for flowers in all known files


    // 'sched' should match the event scheduler app
    eq(startCompletions('sched',services)[0].title,'EventMaker','start event maker')
    // 'schedule meeting tomorrow at 5am' should suggest create a meeting with calculated next day of 5am


    // 'look' should match the dictionary app
    eq(startCompletions('look',services)[0].title,'DictionaryLookup','launch dictionary')
    // 'lookup acorn' should match dictonary app and return action that searches for acorn


    // 'jo' should search for people who's name starts with 'jo', case-insensitive, with action to open each result in contact panel
    // eq(startCompletions('jo',services)[0].title,'PeopleFinder','recognize the people finder')
}

test1()

