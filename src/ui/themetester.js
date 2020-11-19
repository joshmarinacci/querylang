import React, {useContext, useEffect, useState} from 'react'
import {HBox, Toolbar, VBox} from './ui.js'
import {flatten} from '../util.js'

// import "./filebrowser.css"
import {DBContext, decode_props_with_types, encode_props_with_types, propAsString} from '../db.js'

import "./themetester.css"
import {StandardEditPanel} from './StandardEditPanel.js'
import {ENUM, INTEGER, STRING} from '../schema.js'

import { HexColorPicker } from "react-colorful";
import "react-colorful/dist/index.css";
import {PopupManagerContext} from './PopupManager.js'

const COLOR = 'COLOR'
const PADDING = 'PADDING'
const COLOR_PICKER = 'COLOR_PICKER'
const PROPS = {
    '--std-text-color':COLOR_PICKER,
    '--std-bg-color': COLOR,
    '--std-border-color':COLOR,
    '--bg-dark':COLOR,
    '--accent-background-color':COLOR,
    '--std-margin':PADDING,
    '--std-line-margin':PADDING,
    '--std-padding':PADDING,
    '--std-line-padding':PADDING,
    '--radius': PADDING,

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
    if(type === COLOR_PICKER) {
        def = '#00ffff'
    }
    if(type === COLOR) {
        def = 'green'
    }
    if(type === PADDING) {
        def = '0.5em'
    }

    THEME_SCHEMA.SCHEMAS.THEME.props[name] = {
        key:name,
        type:STRING,
        default:def
    }
})

export function ThemeTester({theme, setTheme}) {
    let db = useContext(DBContext)
    let pm = useContext(PopupManagerContext)
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
    const showPicker = (prop) => {
        let picker = <HexColorPicker color={theme.props[prop]} onChange={(c)=>{
            db.setProp(theme,prop,c)
            console.log(theme)
        }} />;
        pm.show(picker)
    }

    let editors = []
    Object.keys(PROPS).forEach(prop => {
        let val = PROPS[prop]
        console.log(val)
        if(val === COLOR_PICKER) {
            editors.push(<button onClick={()=>showPicker(prop)}>{prop}</button>)
        }
        if(val === COLOR) {
            console.log("value is", theme.props[prop])
            editors.push(<label>{prop}</label>)
            editors.push(<input type={'text'} value={theme.props[prop]} onChange={(v)=>{
                console.log("new value is",v)
                db.setProp(theme,prop,v)
            }}/>)
        }
    })

    return <HBox className={'theme-tester'}>
        <VBox className={'controls'}>
            {/*<StandardEditPanel object={theme} customSchema={THEME_SCHEMA}/>*/}
            {/*<button onClick={showPicker}>choose</button>*/}
            {editors}
            <button onClick={doLoad}>load</button>
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
            <form>
                <label>first name</label>
                <input type="text"/>

                <label>age</label>
                <input type="number" step="1" min="0" max="100"/>

                <label>location</label>
                <div className="form-group">
                    <input type="string" placeholder="city" size="10"/>
                    <input type="string" placeholder="state" size="2"/>
                    <input type="string" placeholder="zipcode" size="6"/>
                </div>

                <label>alive?</label>
                <input type="checkbox" checked/>
                <div>
                    <i className="material-icons accent">check_box</i>
                    <i className="material-icons accent">check_box_outline_blank</i>
                </div>

                <label>dead?</label>
                <input type="checkbox"/>

                <label>gender</label>
                <select>
                    <option>male</option>
                    <option>female</option>
                    <option>other</option>
                </select>
            </form>


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