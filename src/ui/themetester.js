import React, {useContext, useEffect, useState} from 'react'
import {HBox, Toolbar, VBox} from './ui.js'
import {flatten} from '../util.js'

// import "./filebrowser.css"
import {DBContext, decode_props_with_types, encode_props_with_types, propAsString} from '../db.js'

import "./themetester.css"
import {StandardEditPanel} from './StandardEditPanel.js'
import {ENUM, INTEGER, STRING} from '../schema.js'

const COLOR = 'COLOR'
const PADDING = 'PADDING'
const PROPS = {
    '--std-text-color':COLOR,
    '--std-bg-color': COLOR,
    '--bg-dark':COLOR,
    '--accent-background-color':COLOR,
    '--std-margin':PADDING,
    '--std-line-margin':PADDING,
    '--std-padding':PADDING,
    '--std-line-padding':PADDING,

}

export const THEME_SCHEMA = {
    ID:"THEME",
    TITLE:'theming system',
    SCHEMAS: {
        THEME: {
            title:'theme',
            props: {
            }
        }
    }
}

Object.keys(PROPS).forEach(name => {
    console.log("property name",name)
    let type = PROPS[name]
    let def = 'green'
    if(type === PADDING) {
        def = '0.5m'
    }

    THEME_SCHEMA.SCHEMAS.THEME.props[name] = {
        key:name,
        type:STRING,
        default:def
    }
})
function DebugPanel({column=1, row=1, caption='caption'}) {
    let cls = {}
    cls['col'+column] = true
    cls['row'+row] = true

    return <div style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        color:'#cccccc',
    }} className={flatten(cls)}>
        {caption}
    </div>
}

export function ThemeTester({theme, setTheme}) {
    let db = useContext(DBContext)
    let style = {}
    Object.keys(PROPS).forEach(name => {
        style[name] = theme.props[name]
    })

    const doLoad = () => {
        let localJSON = localStorage.getItem('theme-tester')
        console.log("local is",localJSON)
        let local = JSON.parse(localJSON,function(key,value) {
            if(key === 'props') return decode_props_with_types(value);
            return value
        })

        console.log("local data is",local)
        // db._fireUpdate(local)
        setTheme(local)
    }
    const doSave = () => {
        console.log("tehem is",theme)
        let json = JSON.stringify(theme,function(key,value){
            if(key === 'props') return encode_props_with_types(value)
            return value
        })
        console.log("encoded",json)
        localStorage.setItem('theme-tester',json)
    }
    return <HBox className={'theme-tester'}>
        <VBox>
            <StandardEditPanel object={theme} customSchema={THEME_SCHEMA}/>
            <button onClick={doLoad}>laod</button>
            <button onClick={doSave}>save</button>
        </VBox>
        <VBox style={style} className={'preview'} grow>
            <HBox>
                <button>button</button>
                <button className={'primary'}>primary</button>
            </HBox>
            <div className="toolbar">
                <button>default</button>
                <button className="primary">primary</button>
                <button disabled>disabled</button>
                <div className="toggle-group">
                    <button className="">option1</button>
                    <button className="selected">option2</button>
                    <button>option3</button>
                </div>
            </div>

        </VBox>
    </HBox>

}


/*
            <Grid3Layout>
                <DebugPanel column={1} row={1}caption={"example"}/>
                <DebugPanel column={1} row={2}caption={"list"}/>
                <Toolbar className={'col2 row1'}>
                    <label>label</label>
                    <Icon className={'icon'}>add</Icon>
                    <Icon className={'icon'}>settings</Icon>
                    <button>button</button>
                </Toolbar>
                <Toolbar className={"col3 row1"}>
                    <Icon className={'icon'}>alarm</Icon>
                    <input type={'search'}/>
                    <Icon className={'icon'}>alarm</Icon>
                </Toolbar>
                <DebugPanel column={2} row={2} caption={'main'}/>
                <DebugPanel column={3} row={2} caption={'more'}/>
            </Grid3Layout>

 */