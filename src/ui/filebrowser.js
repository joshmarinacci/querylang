import React, {useContext, useEffect, useState} from 'react'
import {ActionButton, HBox, Panel, TagsetEditor, ToggleButton, ToggleGroup, Toolbar, VBox} from './ui.js'
import {flatten} from '../util.js'

import "./filebrowser.css"
import {DBContext, propAsString, useDBChanged} from '../db.js'
import Icon from '@material-ui/core/Icon'

import {format} from "date-fns"
import {AND, IS_CATEGORY, IS_TYPE} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import {Grid2Layout} from './grid3layout.js'
import {SourceList, StandardSourceItem} from './sourcelist.js'

export function FileBrowser({}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.FILES.ID)

    let files = db.QUERY(AND(IS_CATEGORY(CATEGORIES.FILES.ID),
        IS_TYPE(CATEGORIES.FILES.SCHEMAS.FILE_INFO.TYPE)))

    let [view,setView] = useState("list")
    let [file,setFile] = useState(null)
    let panel = ""
    if(view === 'list') panel = <FileList files={files} selected={file} setSelected={setFile}/>
    if(view === 'grid') panel =  <FileGrid files={files} selected={file} setSelected={setFile}/>
    let show_add_dialog = () => {
        console.log("you can add a file !")
    }

    let set_wallpaper = () => {
        let elem = document.querySelector("html")
        elem.style.backgroundColor = 'white'
        elem.style.backgroundImage = `url(${file.props.url})`
        elem.style.backgroundSize = "contain"
        elem.style.backgroundRepeat = "no-repeat"
        elem.style.backgroundPosition = 'center'
    }
    return <Grid2Layout>
        <Toolbar className={'col1 span3'}>
            <button onClick={()=>list_remote_files(db)}>refresh</button>
            <ToggleBar value={view} values={['list','grid']} icons={['list','view_module']} setValue={setView}/>
            <input type={'search'} placeholder={'search name'}/>
            <ActionButton onClick={show_add_dialog} caption={"add file"}/>
            <ActionButton onClick={set_wallpaper} caption={"set wallpaper"}/>
        </Toolbar>
        {panel}
        <FileDetailsView file={file}/>
        <div className={'statusbar'}>
            selected = {file?propAsString(file,'filename'):""}
        </div>
    </Grid2Layout>
}

const get_mimetype_major = (str) => str.substring(0,str.indexOf("/"))
const is_image_mimetype = (str) => (get_mimetype_major(str)==='image')
const is_plaintext_mimetype = (str) => (str==='text/plain')
const is_audio_mimetype = (str) => (get_mimetype_major(str)==='audio')
const is_unknown_mimetype = (str) => (str==='application/octet-stream')

function calculateIcon(file) {
    let mt = propAsString(file,'mimetype')
    if(is_image_mimetype(mt)) return 'image'
    if(is_plaintext_mimetype(mt)) return 'text_snippet'
    if(is_audio_mimetype(mt)) return 'audiotrack'
    if(is_unknown_mimetype(mt)) return "?"
    return 'file'
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
    return <SourceList data={files} column={1} row={2} selected={selected} setSelected={setSelected}
                       renderItem={({item,...args})=>{
                           return <StandardSourceItem
                               icon={calculateIcon(item)}
                               title={propAsString(item,'filename')}
                               trailing_text={format(item.props.modified_date,'MMM dd, yyyy')}
                               {...args}/>
                       }}/>
}
function FileGrid({files, selected, setSelected}){
    return <div className={'panel file-grid col1 row2'}>{files.map((file,i)=> {
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
    let mimetype = propAsString(file,'mimetype')
    useEffect(()=>{
        // if(file) console.log("doing the effect", major, file.props.url)
        if(mimetype === 'text/plain')  return generate_text_thumb(file, (text)=>setData(text))
        if(mimetype === 'image/jpeg') return generate_image_thumb(file,(dataurl)=> setData(dataurl))
    })
    return data
}

function calculateActions(file) {
    let actions = []
    if(propAsString(file,'mimetype') === 'audio/mp3') {
        actions.push(<ActionButton caption={'play'}/>)
        actions.push(<ActionButton caption={'convert to WAV'}/>)
        actions.push(<ActionButton caption={'add to Music Library'}/>)
    }
    if(propAsString(file,'mimetype')=== 'image/jpeg') {
        actions.push(<ActionButton caption={"convert to PNG"}/>)
        actions.push(<ActionButton caption={"mark as headshot"}/>)
        actions.push(<ActionButton caption={"mark as desktop wallpaper"}/>)
        actions.push(<ActionButton caption={"edit"}/>)
    }
    if(propAsString(file,'mimetype')=== 'image/png') {
        actions.push(<ActionButton caption={"convert to JPEG"}/>)
    }
    if(propAsString(file,'mimetype')=== 'plain/text') {
        actions.push(<ActionButton caption={"open in Writer"}/>)
    }
    actions.push(<ActionButton caption={"send to phone"}/>)
    actions.push(<ActionButton caption={"send to chat"}/>)
    actions.push(<ActionButton caption={"share on web"}/>)
    actions.push(<ActionButton caption={"email"}/>)
    return actions
}

function FileDetailsView({file}) {
    if(!file) return <div className={'panel file-details col2 row2'}>nothing selected</div>
    return <div className={'file-details-view panel col2 row2'}>
        <span className={'filename'}>{propAsString(file,'filename')}</span>
        <FilePreview file={file}/>
        <TagsetEditor buffer={file} prop={'tags'}/>
        <div className={'actions'}>{calculateActions(file)}</div>
    </div>
}

let MIMETYPE = CATEGORIES.FILES.SCHEMAS.FILE_INFO.props.mimetype.key
function FilePreview({file}) {
    let preview = ""
    let thumb = useThumbnail(file)
    if(propAsString(file,MIMETYPE) === 'image/jpeg') preview = <img className={'thumbnail'} src={thumb} alt={"image preview"}/>
    if(propAsString(file,'mimetype' )=== 'text/plain')  preview = <span className={'thumbnail'}><b>preview</b> {thumb}</span>
    return <div className={'preview'}>{preview}</div>
}

function ToggleBar({value, values, setValue}) {
    return <ToggleGroup>
        {values.map((v,i) => <ToggleButton key={i} caption={v} selected={v === value } onClick={()=>setValue(v)}/>)}
    </ToggleGroup>
}



const FILE_SERVER_URL = "http://localhost:30011/files"
let q = AND(IS_CATEGORY(CATEGORIES.FILES.ID),IS_TYPE(CATEGORIES.FILES.SCHEMAS.FILE_INFO.TYPE))
function list_remote_files(db) {
    return fetch(FILE_SERVER_URL).then(r => r.json()).then(real_files => {
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
    let files = db.QUERY(q)
    return <FileBrowser files={files}/>
}