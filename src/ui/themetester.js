import React, {useContext, useState} from 'react'
import {HBox, Toolbar, VBox} from './ui.js'
import {flatten} from '../util.js'
import {DBContext, encode_props_with_types} from '../db.js'

import "./themetester.css"
import {ENUM, INTEGER, STRING} from '../schema.js'

import {HexColorPicker} from "react-colorful"
import "react-colorful/dist/index.css"
import {PopupManagerContext} from './PopupManager.js'
import {SourceList, StandardSourceItem} from './sourcelist.js'
import {genid} from '../data.js'
import Icon from '@material-ui/core/Icon'

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

    '--std-input-bg-color':COLOR_PICKER,

    '--std-margin':PADDING,
    '--std-line-margin':PADDING,
    '--std-padding':PADDING,
    '--std-line-padding':PADDING,

    '--std-font-family':{
        type:ENUM,
        values:[
            'serif',
            '"Source Sans Pro", sans-serif'
        ]
    },
    '--std-font-size': {
        type:INTEGER,
        min:8,
        max:30,
        unit:'pt'
    },
    '--std-font-weight':{
        type:ENUM,
        values:[
            '100',
            '200',
            '300',
            '400',
            '500',
            '600',
            '700',
            '800',
            '900',
        ]
    }
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
    if(type === ENUM) {
        def = "foo"
    }
    if(type === INTEGER) {
        def = {
            value:10,
        }
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

const content_data = [
    {
        id:genid("content"),
        props: {
            icon:'star',
            text:'primary text',
            trailing_text:'trailing text',
            trailing_icon:'attachment',
            secondary_text:'secondary text',
        }
    },
    {
        id:genid("content"),
        props: {
            icon:'star',
            text:'primary text',
            trailing_text:'trailing text',
            trailing_icon:'attachment',
            secondary_text:'secondary text',
        }
    },
]
export function ThemeTester({theme, setTheme, doLoad}) {
    console.log(theme)
    let db = useContext(DBContext)
    let pm = useContext(PopupManagerContext)

    const [selectedSource, setSelectedSource] = useState(null)
    const [selectedContent, setSelectedContent] = useState(null)

    let style = {}
    Object.keys(PROPS).forEach(name => {
        let info = PROPS[name]
        if(info.type === INTEGER) {
            style[name] = `${theme.props[name].value}${info.unit}`
            console.log("info is",info,style[name])
            return
        }
        style[name] = theme.props[name]
    })


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
        let info = PROPS[prop]
        if(info === COLOR_PICKER) editors.push(<ColorPickerButton prop={prop} theme={theme}/>)
        if(info === COLOR) {
            editors.push(<label>{prop}</label>)
            editors.push(<input type={'text'} value={theme.props[prop]} onChange={(e)=>{
                db.setProp(theme,prop,e.target.value)
            }}/>)
        }
        if(info === 'EM1') {
            editors.push(<label>{prop}</label>)
            editors.push(<input type={'text'} value={theme.props[prop]} onChange={(e)=>{
                db.setProp(theme,prop,e.target.value)
            }}/>)
        }
        if(info === 'PADDING') {
            editors.push(<label>{prop}</label>)
            editors.push(<input type={'text'} value={theme.props[prop]} onChange={(e)=>{
                db.setProp(theme,prop,e.target.value)
            }}/>)
        }
        if(typeof info === 'object') {
            if(info.type === INTEGER) {
                editors.push(<label>{prop}</label>)
                let vv = 10
                if(theme.props[prop].value) vv = theme.props[prop].value
                editors.push(<HBox>
                    <input type={'number'} value={vv} onChange={(e)=>{
                    db.setProp(theme,prop,{value:e.target.value})
                }}/>
                    <label>{info.unit}</label>
                </HBox>)
            }
            if(info.type === ENUM) {
                editors.push(<label>{prop}</label>)
                let vals = info.values
                editors.push(<select value={theme.props[prop]} onChange={e => {
                    db.setProp(theme,prop,e.target.value)
                }}>{vals.map(v=><option>{v}</option>)}</select>)
            }
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
                    <Icon>filter_list</Icon>
                    <input type="search" placeholder="search here" className={'grow'}/>
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
                    className={'sidebar'}
                    renderItem={({item,...rest})=>{
                        return <StandardSourceItem
                            header={item.props.header}
                            title={item.props.title}
                            icon={item.props.icon}
                            {...rest}
                        />
                    }}
                />


                <SourceList
                    column={2}
                    row={2}
                    data={content_data}
                    className={'content'}
                    selected={selectedContent}
                    setSelected={setSelectedContent}
                    renderItem={({item,...rest})=>{
                        return <StandardSourceItem
                            icon={item.props.icon}
                            title={item.props.text}
                            trailing_icon={item.props.trailing_icon}
                            subtitle={'subtitle'}

                            {...rest}/>
                    }}/>

                <form>
                    <label>first name</label>
                    <input type="text" value={"Josh"}/>

                    <label>age</label>
                    <input type="number" step="1" min="0" max="100" value={25}/>

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
    return <div className={'toggle-group'}>{children}</div>
}