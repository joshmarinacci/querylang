import React from "react";

import * as codemirror from 'codemirror';

import { Controlled as CodeMirror } from "react-codemirror2";
//standard styling
import "codemirror/lib/codemirror.css";
// import "codemirror/theme/material.css";
// import "codemirror/mode/javascript/javascript";
import "codemirror/addon/hint/show-hint";
// import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/keymap/sublime";
// import "codemirror/addon/edit/closebrackets";
// import "codemirror/addon/edit/closetag";
// import "codemirror/addon/fold/foldcode";
// import "codemirror/addon/fold/foldgutter";
// import "codemirror/addon/fold/brace-fold";
// import "codemirror/addon/fold/comment-fold";
// import "codemirror/addon/fold/foldgutter.css";
import "./commandbar2.css"


const APP_NAMES = [
    "chat",
    "Calendar",
]

class OpenAppAction {
    constructor(name) {
        this.name = name
        this.title = `Open ${name}`
    }
}

const APP_OPENER = {
    title:'AppOpener',
    command:'open',
    prefixMatch:(str) => {
        return "open".startsWith(str)
    },
    findActions: (args) => {
        return APP_NAMES.filter(a => a.toLowerCase().startsWith(args[0].toLowerCase()))
            .map(name => new OpenAppAction(name))
    },
    get_completions: (args) => {
        console.log("scanning args",args)
        let name = args[1]
        name = name.toLowerCase()
        const name_match = (a => a.toLowerCase().startsWith(name))
        return APP_NAMES.filter(name_match).map(app => {
            return {
                text: args[0] + ' ' + app,
                displayText: `Open ${app}`
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

const COMMAND_SERVICES = [
    APP_OPENER,
    URL_SCANNER,
]

function synonyms(cm, option) {
    console.log("inside synonyms", cm, option)
    var cursor = cm.getCursor()
    let line = cm.getLine(cursor.line)
    var start = cursor.ch
    let end = cursor.ch
    //find anything that matches the line
    let len = line.length
    let args = line.split(" ")
    console.log('line',line,start,end,args, 'len',len)

    let list = []
    COMMAND_SERVICES.forEach(svc => {
        if(svc.prefixMatch(args[0])) {
            if(args.length > 1) {
                console.log('more args',args)
                svc.get_completions(args).forEach(it => list.push(it))
            } else {
                list.push({
                    text: svc.command + " ",
                })
            }
        }
    })


    let results = {
        from: codemirror.Pos(0, 0),
        to: codemirror.Pos(0, 6),
        list: list,
    }
    return Promise.resolve(results)
}


function execute_action(value) {
    console.log('executing the action',value)
}

export function CommandBar2() {
    const [code, setCode] = React.useState("");
    const [shouldEval, setShouldEval] = React.useState(false)

    const apply_code = () => {
        console.log("applying the code",code)
        execute_action(code)
    }
    if(shouldEval) {
        apply_code()
        setCode("")
        setShouldEval(false)
    }
    return (
        <div className={'codemirror-commandbar-wrapper'}>
            <CodeMirror
                value={code}
                autoScroll={false}
                autoCursor={true}
                detach={false}
                options={{
                    mode: "idealos",
                    lineWrapping: false,
                    smartIndent: false,
                    lineNumbers: false,
                    foldGutter: false,
                    // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                    autoCloseTags: false,
                    // keyMap: "sublime",
                    matchBrackets: false,
                    autoCloseBrackets: false,
                    extraKeys: {
                        "Ctrl-Space": "autocomplete",
                        "Tab": "autocomplete",
                    },
                    hintOptions:{
                        hint: synonyms,
                    }
                }}
                onBeforeChange={(editor, data, value) => {
                    //don't let you enter newlines to restrict to one line
                    if(value.indexOf('\n')>=0) value = value.replaceAll("\n","")
                    setCode(value);
                }}
                onKeyHandled={(cm,name,ev)=>{
                    console.log("name",name)
                    if(ev.key === 'Enter') {
                        console.log("enter pressed")
                        // setShouldEval(true)
                    }
                }}
                onInputRead={()=>{
                    console.log("input read")
                }}
                onChange={(editor, data, value) => {
                    // console.log('onChange: ',value)
                }}
                // editorDidMount={(editor)=>{
                //     // console.log('mounted the editor',editor)
                // }}
            />

        </div>
    );
}


