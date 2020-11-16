import React, {useState} from 'react'
import {HBox, Toolbar, VBox} from './ui.js'
import {flatten} from '../util.js'

import "./filebrowser.css"
import {propAsString} from '../db.js'
import Icon from '@material-ui/core/Icon'

import {format} from "date-fns"

export function FileBrowser({files}) {
    let [view,setView] = useState("list")
    let [file,setFile] = useState(null)
    let panel = ""
    if(view === 'list') {
        panel = <FileList files={files} selected={file} setSelected={setFile}/>
    }
    if(view === 'grid') {
        panel =  <FileGrid files={files}/>
    }
    let show_add_dialog = () => {
        console.log("you can add a file !")
    }

    let set_wallpaper = () => {
        console.log("setting the wallpaper to",file)
    }
    return <div className={'file-browser'}>
        <h3>file browser</h3>
        <Toolbar>
            <ToggleBar value={view} values={['list','grid']} setValue={setView}/>
            <input type={'search'} placeholder={'search name'}/>
            <button onClick={show_add_dialog}>add file</button>
            <button onClick={set_wallpaper}>set wallpaper</button>
        </Toolbar>
        <HBox>
        {panel}
        <FileDetailsView file={file}/>
        </HBox>
    </div>
}


function calculateIcon(file) {
    let major = propAsString(file,'mimetype_major')
    if(major === 'image') {
        return <Icon className="icon">image</Icon>
    }
    if(major === 'text') {
        return <Icon className="icon">text_snippet</Icon>
    }
    return "file"
}

function calculateGridIcon(file) {
    let major = propAsString(file,'mimetype_major')
    if(major === 'image') {
        return <Icon className="icon">image</Icon>
    }
    if(major === 'text') {
        return <Icon className="icon">text_snippet</Icon>
    }
    return "file"
}

function FileList({files, selected, setSelected}){
    return <div className={'file-list'}>{files.map((file,i)=>{
        return <div className={flatten({
            'file-list-item':true,
            selected:file===selected,
        })} key={i} onClick={()=>setSelected(file)}>
            {calculateIcon(file)}
            <span className={'filename'}>{propAsString(file,'filename')}</span>
            <span className={'modified'}>{format(file.props.modified_date,'MMM dd, yyyy')}</span>
        </div>
    })}</div>
}
function FileGrid({files}){
    // a grid of files. 100px tiles.  just name and mimetype appropriate icon.
    return <div className={'file-grid'}>{files.map((file,i)=> {
        return <div className={'file-grid-item'} key={i}>
            {calculateGridIcon(file)}
            <span className={'filename'}>{propAsString(file, 'filename')}</span>
        </div>
    })}</div>
}
function FileDetailsView({file}) {
    // all data in props using a standard object viewer
    // plus an image thumbnail if relevant
    if(!file) return <div className={'file-details'}>nothing selected</div>
    return <div>details of file {propAsString(file,'filename')}</div>
}
function ToggleBar({value, values, setValue}) {
    // a toggle button for each option
    return <HBox className={'toggle-bar'}>
        {values.map(v => <ToggleButton value={v} selected={v === value } onClick={()=>setValue(v)}/>)}
    </HBox>
}

function ToggleButton({onClick, selected, value}) {
    return <button onClick={onClick} className={flatten({
        selected:selected,
        'toggle-button':true,
    })}>{value}</button>
}



export const FILES = 'FILES'
export const FILE_INFO = 'FILE_INFO'
