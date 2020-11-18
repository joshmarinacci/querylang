import React, {useContext, useEffect, useState} from 'react'
import {HBox, Toolbar, VBox} from './ui.js'
import {flatten} from '../util.js'

import "./filebrowser.css"
import {DBContext, decode_props_with_types, encode_props_with_types, propAsString} from '../db.js'
import Icon from '@material-ui/core/Icon'

import {format} from "date-fns"
import {DATA, genid} from '../data.js'

import "./themetester.css"
import {StandardEditPanel} from './StandardEditPanel.js'
import {ENUM, INTEGER, STRING} from '../schema.js'
import {Grid3Layout} from './grid3layout.js'

const COLOR = 'COLOR'
const PADDING = 'PADDING'
const PROPS = {
    '--std-text-color':COLOR,
    '--std-bg-color': COLOR,
    '--accent-background-color':COLOR,
    '--std-line-padding':PADDING,
    '--std-margin':PADDING,

}

export const THEME_SCHEMA = {
    ID:"THEME",
    TITLE:'theming system',
    SCHEMAS: {
        THEME: {
            title:'theme',
            props: {
                /*
                fontfamily:{
                    key: 'fontfamily',
                    title:'font family',
                    type: ENUM,
                    values: ['sans1', 'sans2'],
                    default: 'sans1'
                },
                base_font_size: {
                    key:'base_font_size',
                    title:'base font size',
                    type:INTEGER,
                    default:'10'
                },
                base_font_weight: {
                    key:'base_font_weight',
                    type:ENUM,
                    values:['100','200','300','400','500','600','700','800'],
                    default:'400',
                },
                text_color: {
                    key:'text_color',
                    type:STRING,
                    default:'#000000',
                },
                background_color: {
                    key:'background_color',
                    type:STRING,
                    default:'#ffffff',
                },
                background_2: {
                    key:'background_2',
                    type:STRING,
                    default:'#f0e0d0',
                },
                toolbar_padding: {
                    key:'toolbar_padding',
                    type:INTEGER,
                    default: 5,
                },
                base_margin: {
                    key:'base_margin',
                    type:INTEGER,
                    default: 5,
                },
                base_border_radius: {
                    key:'base_border_radius',
                    type:INTEGER,
                    default: 5,
                },
                accent_color: {
                    key:'accent_color',
                    type:STRING,
                    default:'orange',
                },
                inverse_accent_color: {
                    key:'inverse_accent_color',
                    type:STRING,
                    default:'white',
                }
                 */
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