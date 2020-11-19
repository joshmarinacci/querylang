import React, {useContext, useEffect, useState} from 'react'
import {DataList, HBox, Toolbar, VBox} from './ui.js'
import {flatten} from '../util.js'

// import "./filebrowser.css"
import {DBContext, decode_props_with_types, encode_props_with_types, propAsString} from '../db.js'

import "./themetester.css"
import {StandardEditPanel} from './StandardEditPanel.js'
import {ENUM, INTEGER, STRING} from '../schema.js'

import { HexColorPicker } from "react-colorful";
import "react-colorful/dist/index.css";
import {PopupManagerContext} from './PopupManager.js'
import {SourceList, StandardSourceItem} from './sourcelist.js'
import {genid} from '../data.js'

const COLOR = 'COLOR'
const PADDING = 'PADDING'
const COLOR_PICKER = 'COLOR_PICKER'
const PROPS = {
    '--std-text-color':COLOR_PICKER,
    '--std-bg-color': COLOR_PICKER,
    '--std-border-color':COLOR_PICKER,
    '--bg-dark':COLOR_PICKER,

    '--accent-text-color':COLOR_PICKER,
    '--accent-background-color':COLOR_PICKER,
    '--accent-border-color':COLOR_PICKER,

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

const sidebar_data = [
    {
        id:genid('library'),
        props: {
            header:true,
            title:'library',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'all',
            icon:'library_music',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'artists',
            icon:'people',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'albums',
            icon:'album',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'songs',
            icon:'music_video',
        }
    },
    {
        id:genid('library'),
        props: {
            header:true,
            title:'playlists',
            icon:'songs',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'Best of 1985',
            icon:'queue_music',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'Funo',
            icon:'queue_music',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'Late Night 80s',
            icon:'queue_music',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'Best of 1985',
            icon:'queue_music',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'Funo',
            icon:'queue_music',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'Late Night 80s',
            icon:'queue_music',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'Best of 1985',
            icon:'queue_music',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'Funo',
            icon:'queue_music',
        }
    },
    {
        id:genid('library'),
        props: {
            header:false,
            title:'Late Night 80s',
            icon:'queue_music',
        }
    },
]

export function ThemeTester({theme, setTheme}) {
    let db = useContext(DBContext)
    let pm = useContext(PopupManagerContext)

    const [selectedSource, setSelectedSource] = useState(null)

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
        if(local) setTheme(local)
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

    let editors = []
    Object.keys(PROPS).forEach(prop => {
        let val = PROPS[prop]
        if(val === COLOR_PICKER) editors.push(<ColorPickerButton prop={prop} theme={theme}/>)
        if(val === COLOR) {
            editors.push(<label>{prop}</label>)
            editors.push(<input type={'text'} value={theme.props[prop]} onChange={(e)=>{
                db.setProp(theme,prop,e.target.value)
            }}/>)
        }
        if(val === 'EM1') {
            editors.push(<label>{prop}</label>)
            editors.push(<input type={'text'} value={theme.props[prop]} onChange={(e)=>{
                db.setProp(theme,prop,e.target.value)
            }}/>)
        }
        if(val === 'PADDING') {
            editors.push(<label>{prop}</label>)
            editors.push(<input type={'text'} value={theme.props[prop]} onChange={(e)=>{
                db.setProp(theme,prop,e.target.value)
            }}/>)
        }
    })

    return <HBox className={'theme-tester'}>
        <VBox className={'controls'}>
            {editors}
            <button onClick={doLoad}>load</button>
            <button onClick={doSave}>save</button>
        </VBox>
        <VBox style={style} className={'preview'} grow>

            <div className="grid">
                <div className="info">
                    Controls Demo
                </div>
                <div className="toolbar">
                    <i className="icon">library_music</i>
                    <input type="search" placeholder="search here"/>
                </div>

                <Toolbar>
                    <ActionButton caption={'default'}/>
                    <ActionButton caption={'primary'} primary/>
                    <ActionButton caption={'disabled'} disabled/>
                    <ToggleGroup>
                        <ToggleButton caption={'option 1'}/>
                        <ToggleButton selected caption={'option 2'}/>
                        <ToggleButton caption={'option 3'}/>
                    </ToggleGroup>
                </Toolbar>

                <SourceList
                    column={1}
                    row={2}
                    selected={selectedSource}
                    setSelected={setSelectedSource}
                    data={sidebar_data}
                    renderItem={({item,...rest})=>{
                        return <StandardSourceItem
                            header={item.props.header}
                            title={item.props.title}
                            icon={item.props.icon}
                            {...rest}
                        />
                    }}
                />


                <ul className="content">
                    <li className="vbox">
                        <div className="hbox">
                            <i className="material-icons accent">star</i>
                            <span className="primary grow">primary text</span>
                            <span className="trailing">trailing text</span>
                            <i className="material-icons">attachment</i>
                        </div>
                        <div className="hbox">
                            <i className="material-icons">x</i>
                            <span className="secondary grow">secondary text</span>
                            <i className="material-icons">x</i>
                        </div>
                    </li>
                    <li className="vbox selected">
                        <div className="hbox">
                            <i className="material-icons accent">star</i>
                            <span className="primary grow">primary text</span>
                            <span className="trailing">trailing text</span>
                            <i className="material-icons">attachment</i>
                        </div>
                        <div className="hbox">
                            <i className="material-icons">x</i>
                            <span className="secondary grow">secondary text</span>
                            <i className="material-icons">x</i>
                        </div>
                    </li>
                    <li className="vbox">
                        <div className="hbox">
                            <i className="material-icons accent">star</i>
                            <span className="primary grow">primary text</span>
                            <span className="trailing">trailing text</span>
                            <i className="material-icons">attachment</i>
                        </div>
                        <div className="hbox">
                            <i className="material-icons">x</i>
                            <span className="secondary grow">secondary text</span>
                            <i className="material-icons">x</i>
                        </div>
                    </li>
                </ul>

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
                <div className="statusbar">
                    <label>100 selected</label>
                    <span className="spacer"></span>
                    <label>40x50px</label>
                </div>
            </div>


        </VBox>
    </HBox>
}

function ColorPickerButton({theme,prop}) {
    let db = useContext(DBContext)
    let pm = useContext(PopupManagerContext)

    const showPicker = (prop) => {
        let picker = <HexColorPicker color={theme.props[prop]} onChange={(c)=>{
            db.setProp(theme,prop,c)
            console.log(theme)
        }} />;
        pm.show(picker)
    }

    let styl = {
        backgroundColor:theme.props[prop],
    }
    return <button onClick={()=>showPicker(prop)} style={styl}>{prop}</button>
}

function ActionButton({caption}) {
    return <button>{caption}</button>
}
function ToggleButton({caption, selected}) {
    let cls = {
        selected:selected
    }
    return <button className={flatten(cls)}>{caption}</button>
}
function ToggleGroup({children}) {
    return <div>{children}</div>
}