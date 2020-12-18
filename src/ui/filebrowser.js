import React, {useContext, useState} from 'react'
import {ActionButton, StatusBar, TagsetEditor, TextPropEditor, ToggleButton, ToggleGroup, Toolbar} from './ui.js'
import {flatten} from '../util.js'

import "./filebrowser.css"
import {DBContext, hasProp, propAsDate, propAsString, useDBChanged} from '../db.js'
import Icon from '@material-ui/core/Icon'

import {format} from "date-fns"
import {AND, IS_CATEGORY, IS_TYPE} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import {Grid2Layout} from './grid3layout.js'
import {DataList, StandardSourceItem} from './dataList.js'
import {FilePreview} from './filepreview.js'
import {DialogManagerContext} from './DialogManager.js'
import {calculate_data_url, list_files} from '../services/files.js'
import {StandardViewPanel} from './StandardViewPanel.js'

function Dialog({title,children,...rest}) {
    return <div className={'dialog'} {...rest}>
        <h1>{title}</h1>
        {children}
    </div>
}
function AddRemoteFileDialog({onDone}) {
    let [url, setUrl] = useState("")
    return <Dialog title={'add a remote file by url'}>
        <input type={"text"} value={url} onChange={(e)=>setUrl(e.target.value)}/>
        <button onClick={()=>onDone(url)}>done</button>
    </Dialog>
}
export function FileBrowser({}) {
    let db = useContext(DBContext)
    let dm = useContext(DialogManagerContext)
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
        dm.show(<AddRemoteFileDialog onDone={url => {
            dm.hide()
            console.log("need to add the url",url)
        }}/>)
    }

    let set_wallpaper = () => {
        let elem = document.querySelector("html")
        elem.style.backgroundColor = 'white'
        elem.style.backgroundImage = `url(${file.props.url})`
        elem.style.backgroundSize = "contain"
        elem.style.backgroundRepeat = "no-repeat"
        elem.style.backgroundPosition = 'center'
    }
    let style = {
        gridTemplateColumns: '1fr 20em',
        gridTemplateRows: '3em 1fr 2em',
    }

    return <div className={"grid"} style={style}>
        <Toolbar className={'col1 span3'}>
            <button onClick={()=>list_remote_files(db)}>refresh</button>
            <ToggleBar value={view} values={['list','grid']} icons={['list','view_module']} setValue={setView}/>
            <input type={'search'} placeholder={'search name'}/>
            <ActionButton onClick={show_add_dialog} caption={"add file"}/>
            <ActionButton onClick={set_wallpaper} caption={"set wallpaper"}/>
        </Toolbar>
        {panel}
        <FileDetailsView file={file}/>
        <StatusBar className={'row3 col1 span3'}>
            selected = {file?propAsString(file,'filename'):""}

        </StatusBar>
    </div>
}

const get_mimetype_major = (str) => str.substring(0,str.indexOf("/"))
const is_image_mimetype = (str) => (get_mimetype_major(str)==='image')
const is_plaintext_mimetype = (str) => (str==='text/plain')
const is_audio_mimetype = (str) => (get_mimetype_major(str)==='audio')
const is_pdf_mimetype = (str) => (str === 'application/pdf')
const is_unknown_mimetype = (str) => (str==='application/octet-stream')

function calculateIcon(file) {
    let mt = propAsString(file,'mimetype')
    console.log("chekcing mt",mt);
    if(is_image_mimetype(mt)) return 'image'
    if(is_plaintext_mimetype(mt)) return 'text_snippet'
    if(is_audio_mimetype(mt)) return 'audiotrack'
    if(is_unknown_mimetype(mt)) return "?"
    if(is_pdf_mimetype(mt)) return "picture_as_pdf"
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
    return <DataList data={files} column={1} row={2} selected={selected} setSelected={setSelected}
                     renderItem={({item,...args})=>{
                           return <StandardSourceItem
                               icon={calculateIcon(item)}
                               title={propAsString(item,'filename')}
                               trailing_text={format(propAsDate(item,'modified_date'),'MMM dd, yyyy')}
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


function calculateActions(file) {
    let actions = []
    if(propAsString(file,'mimetype') === 'audio/mp3') {
        // actions.push(<ActionButton caption={'play'}/>)
        // actions.push(<ActionButton caption={'convert to WAV'}/>)
        // actions.push(<ActionButton caption={'add to Music Library'}/>)
    }
    if(propAsString(file,'mimetype')=== 'image/jpeg') {
        // actions.push(<ActionButton caption={"convert to PNG"}/>)
        // actions.push(<ActionButton caption={"mark as headshot"}/>)
        // actions.push(<ActionButton caption={"mark as desktop wallpaper"}/>)
        // actions.push(<ActionButton caption={"edit"}/>)
    }
    if(propAsString(file,'mimetype')=== 'image/png') {
        // actions.push(<ActionButton caption={"convert to JPEG"}/>)
    }
    if(propAsString(file,'mimetype')=== 'plain/text') {
        // actions.push(<ActionButton caption={"open in Writer"}/>)
    }
    // actions.push(<ActionButton caption={"send to phone"}/>)
    // actions.push(<ActionButton caption={"send to chat"}/>)
    // actions.push(<ActionButton caption={"share on web"}/>)
    // actions.push(<ActionButton caption={"email"}/>)
    return actions
}

function FileDetailsView({file}) {
    if(!file) return <div className={'panel file-details col2 row2'}>nothing selected</div>
    // console.log("file is",file)
    return <div className={'file-details-view panel col2 row2'}>
        <TextPropEditor buffer={file} prop={'filename'}/>
        {hasProp(file,'title')?("title:" + propAsString(file,"title")):""}
        <label>size</label><b>{propAsString(file,'filesize')} bytes</b>
        <FilePreview file={file}/>
        <label>tags</label><TagsetEditor buffer={file} prop={'tags'}/>
        <div className={'actions'}>{calculateActions(file)}</div>
    </div>
}

function ToggleBar({value, values, setValue}) {
    return <ToggleGroup>
        {values.map((v,i) => <ToggleButton key={i} caption={v} selected={v === value } onClick={()=>setValue(v)}/>)}
    </ToggleGroup>
}



let q = AND(IS_CATEGORY(CATEGORIES.FILES.ID),IS_TYPE(CATEGORIES.FILES.SCHEMAS.FILE_INFO.TYPE))
function list_remote_files(db) {
    return list_files().then(real_files => {
        let info_files = db.QUERY(q)
        console.log("info files",info_files)
        console.log("real files",real_files)
        real_files.forEach(f => {
            let url = calculate_data_url(f)
            let match = info_files.find(i => {
                return (i.props.url === url)
            })
            if(!match) {
                console.log('adding a new file from',f)
                let info = db.make(CATEGORIES.FILES.ID,CATEGORIES.FILES.SCHEMAS.FILE_INFO.TYPE)
                info.props.filename = f.info.basename
                info.props.url = calculate_data_url(f)
                info.props.mimetype = f.info.mime
                info.props.fileid = f.fileid
                info.props.filesize = f.info.size
                if(f.info.pdf && f.info.pdf.title) {
                    info.props.title = f.info.pdf.title
                }
                if(info.props.mimetype === 'image/jpeg') {
                    info.props.meta = f.info.image
                }
                console.log("adding",info)
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