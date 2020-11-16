import React, {useEffect, useState} from 'react'
import {HBox, Toolbar, VBox} from './ui.js'
import {flatten} from '../util.js'

import "./filebrowser.css"
import {propAsString} from '../db.js'
import Icon from '@material-ui/core/Icon'

import {format} from "date-fns"
import {DATA, genid} from '../data.js'

export function FileBrowser({files}) {
    let [view,setView] = useState("list")
    let [file,setFile] = useState(null)
    let panel = ""
    if(view === 'list') panel = <FileList files={files} selected={file} setSelected={setFile}/>
    if(view === 'grid') panel =  <FileGrid files={files} selected={file} setSelected={setFile}/>
    let show_add_dialog = () => {
        console.log("you can add a file !")
    }

    let set_wallpaper = () => {
        console.log("setting the wallpaper to",file)
    }
    return <div className={'file-browser'}>
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
function FileGrid({files, selected, setSelected}){
    return <div className={'file-grid'}>{files.map((file,i)=> {
        return <div className={flatten({
            'file-grid-item':true,
            selected:file===selected,
        })} key={i} onClick={()=>setSelected(file)}>
            {calculateGridIcon(file)}
            <span className={'filename'}>{propAsString(file, 'filename')}</span>
        </div>
    })}</div>
}

let DATA_CACHE = {}
function generate_image_thumb(file, cb) {
    if(DATA_CACHE[file.props.url]) return cb(DATA_CACHE[file.props.url])

    console.log("loading image thumb",file.props.url)
    fetch(`http://localhost:30011/proxy?url=${file.props.url}`,{
        mode:'cors'
    }).then(r => r.blob())
        .then(blob => {
            let blob_url = URL.createObjectURL(blob)
            // console.log("blob url is",blob_url)
            let img3 = new Image()
            img3.crossOrigin = "Anonymous"
            img3.onload = () => {
                // console.log("image loaded",img3,img3.width, img3.height)
                let can = document.createElement('canvas')
                let sw = img3.width/256
                let sh = img3.height/256
                // console.log(sw,sh)
                let sc = Math.max(sw,sh)
                // console.log("scaling down by",sc)
                can.width = img3.width/sc
                can.height = img3.height/sc
                let c = can.getContext('2d')
                c.fillStyle = 'blue'
                c.fillRect(0,0,256,256)
                c.save()
                c.scale(1/sc,1/sc)
                c.drawImage(img3,0,0)
                c.restore()
                let url =  can.toDataURL("image/png")
                // console.log("final url is",url)
                console.log("generated thumbnail")
                DATA_CACHE[file.props.url] = url
                cb(url)
            }
            img3.src = blob_url
        })
}

function generate_text_thumb(file, cb) {
    if(DATA_CACHE[file.props.url]) return cb(DATA_CACHE[file.props.url])
    console.log("loading the text", file.props.url)
    fetch(`http://localhost:30011/proxy?url=${file.props.url}`,{
        mode:"cors"
    }).then(r => r.text()).then((r)=>{
        console.log("result",r)
        let thumb = r.length > 255?r.substring(0,255):r
        console.log("thumb data",thumb)
        DATA_CACHE[file.props.url] = thumb
        cb(thumb)
    }).catch(e => {
        console.log("error happened")
        cb("cannot connect to thumbnail server")
    })
}

function useThumbnail(file) {
    let [data,setData] = useState(null)
    let major = propAsString(file,'mimetype_major')
    useEffect(()=>{
        // if(file) console.log("doing the effect", major, file.props.url)
        if(major === 'text')  return generate_text_thumb(file, (text)=>setData(text))
        if(major === 'image') return generate_image_thumb(file,(dataurl)=> setData(dataurl))
    })
    return data
}

function FileDetailsView({file}) {
    // all data in props using a standard object viewer
    // plus an image thumbnail if relevant
    let thumb = useThumbnail(file)
    if(!file) return <div className={'file-details'}>nothing selected</div>
    let preview = ""
    if(propAsString(file,'mimetype_major') === 'image') preview = <img className={'thumbnail'} src={thumb} alt={"image preview"}/>
    if(propAsString(file,'mimetype_major' )=== 'text')  preview = <span className={'thumbnail'}><b>preview</b> {thumb}</span>
    return <div className={'file-details-view'}>
        {propAsString(file,'filename')}
        {preview}
    </div>
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



export function FileBrowserApp({app}) {
    let [files, setFiles] = useState(()=>{
        let data = []
        data.push({
            id:genid('file-meta'),
            category:FILES,
            type:FILE_INFO,
            props: {
                creation_date: new Date(2001),
                modified_date: new Date(2020,11),
                tags:['history'],
                mimetype_major:'text',
                mimetype_minor:'plain',
                filename:'const.txt',
                url:"https://www.usconstitution.net/const.txt",
                filesize:-1,
                type_info:{
                    infotype:'text',
                },
                deleted:false,
            }
        })
        return data
    })
    return <div>
        <FileBrowser files={files}/>
    </div>
}