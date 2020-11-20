import React, {useContext, useEffect, useState} from 'react'
import {ActionButton, HBox, Panel, ToggleButton, ToggleGroup, Toolbar, VBox} from './ui.js'
import {flatten} from '../util.js'

import "./filebrowser.css"
import {DBContext, propAsString, useDBChanged} from '../db.js'
import Icon from '@material-ui/core/Icon'

import {format} from "date-fns"
import {AND, IS_CATEGORY, IS_TYPE} from '../query2.js'
import {CATEGORIES} from '../schema.js'

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
            <ToggleBar value={view} values={['list','grid']} icons={['list','view_module']} setValue={setView}/>
            <input type={'search'} placeholder={'search name'}/>
            <ActionButton onClick={show_add_dialog} caption={"add file"}/>
            <ActionButton onClick={set_wallpaper} caption={"set wallpaper"}/>
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
    return <ToggleGroup>
        {values.map((v,i) => <ToggleButton key={i} caption={v} selected={v === value } onClick={()=>setValue(v)}/>)}
    </ToggleGroup>
}


/*

// fetch list of real files
// search for file info that matches each real file
//if missing info, generate one, add to database
//put list of file infos into state
let you view and edit the metadata, but just the tags. (edit panel should let you make things be readonly)
make settings app let you choose a background image by searching for all images with the ‘desktop’ tag on it
list apps that can open the file. ex: txt can open in ‘writer’ image can open in an ‘image viewer’, files can be opened in a new email. requires calculating app / panel  compatibility
contacts app lets you choose an image from all images as headshot, auto-scales. people bar auto updates.
 */


const FILE_SERVER_URL = "http://localhost:30011/files"
function list_remote_files(db) {
    return fetch(FILE_SERVER_URL).then(r => r.json()).then(real_files => {
        let q = AND(IS_CATEGORY(CATEGORIES.FILES.ID),IS_TYPE(CATEGORIES.FILES.SCHEMAS.FILE_INFO.TYPE))
        let info_files = db.QUERY(q)
        console.log("info files",info_files)
        real_files.forEach(f => {
            let url = `${FILE_SERVER_URL}/${f.name}${f.ext}`;
            let match = info_files.find(i => {
                return (i.props.url === url)
            })
            if(!match) {
                let info = db.make(CATEGORIES.FILES.ID,CATEGORIES.FILES.SCHEMAS.FILE_INFO.TYPE)
                info.props.filename = f.name
                info.props.url = url
                info.props.mimetype = f.mimetype
                db.add(info)
            }
        })
        return info_files = db.QUERY(q)
    })
}

export function FileBrowserApp({app}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.FILES.ID)
    let [files, setFiles] = useState([])
    return <Panel grow>
        <button onClick={()=>list_remote_files(db).then(files=>setFiles(files))}>open</button>
        <FileBrowser files={files}/>
    </Panel>
}