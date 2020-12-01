import React, {useContext, useState} from "react"
import "./commandbar3.css"
import {DBContext, propAsString} from '../db.js'
import {AND, IS_CATEGORY, IS_PROP_SUBSTRING, IS_TYPE, OR} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import * as chrono from 'chrono-node'
import {flatten} from '../util.js'
import {ActionManagerContext, COMMAND_SERVICES} from '../services/ActionManager.js'
import {AppLauncherContext} from '../services/AppLauncherService.js'


function find_results(code, db) {
    let cmds = db.QUERY(AND(IS_CATEGORY(CATEGORIES.APP.ID),IS_TYPE(CATEGORIES.APP.SCHEMAS.SEARCH_PLUGIN.TYPE) ))
    let args = code.split(" ")
    if(args[0] === '') return []
    // console.log("=== searching for results to",args)
    let list = []
    cmds.forEach(obj => {
        let svc = obj.props.plugin
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
