import React, {useState} from 'react'
import {HBox, Toolbar, VBox} from './ui.js'
import {flatten} from '../util.js'

import "./filebrowser.css"

export function FileBrowser({files}) {
    let [view,setView] = useState("list")
    let [file,setFile] = useState(null)
    let panel = ""
    if(view === 'list') {
        panel = <FileList files={files}/>
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
        <HBox>file browser</HBox>
        <VBox>
            <Toolbar>
                <ToggleBar value={view} values={['list','grid']} setValue={setView}/>
                <input type={'search'} placeholder={'search name'}/>
                <button onClick={show_add_dialog}>add file</button>
                <button onClick={set_wallpaper}>set wallpaper</button>
            </Toolbar>
            {panel}
        </VBox>
        <FileDetailsView file={file}/>
    </div>
}


function FileList({}){
    // a list of files showing name, format, last modified date
    return <div>file list</div>
}
function FileGrid({}){
    // a grid of files. 100px tiles.  just name and mimetype appropriate icon.
    return <div>file grid</div>
}
function FileDetailsView({}) {
    // all data in props using a standard object viewer
    // plus an image thumbnail if relevant
    return <div>details</div>
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
