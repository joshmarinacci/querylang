import React from "react";

import * as codemirror from 'codemirror';

import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
// import "codemirror/mode/javascript/javascript";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
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


function synonyms(cm, option) {
    console.log("inside synonyms", cm, option)
    let results = {
        from: codemirror.Pos(0, 0),
        to: codemirror.Pos(0, 5),
        list: [
            {
                text: 'one',
                displayText: "the One",
            },
            {
                text: 'two',
                displayText: "the Two",
            }
        ]
    }
    return Promise.resolve(results)
}


export function CommandBar2() {
    const [code, setCode] = React.useState("fo");

    return (
        <div className={'codemirror-commandbar-wrapper'}>
            <CodeMirror
                value={code}
                autoScroll={false}
                autoCursor={true}
                options={{
                    mode: "idealos",
                    lineWrapping: false,
                    smartIndent: false,
                    lineNumbers: false,
                    foldGutter: false,
                    // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                    autoCloseTags: false,
                    keyMap: "sublime",
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
                    if(value.indexOf("\n")>=0) {
                        value = value.replaceAll("\n","")
                    }
                    setCode(value);
                }}
                onKeyUp={function (cm, event) {
                    // cm.showHint()
                }}
                onChange={(editor, data, value) => {}}
                editorDidMount={(editor)=>{
                    // console.log('mounted the editor',editor)
                }}
            />

        </div>
    );
}


