import {propAsString} from '../db.js'
import React, {useEffect, useState} from 'react'
import {CATEGORIES} from '../schema.js'
import {PROXY_SERVER_URL} from '../globals.js'
import {calculate_thumb_url, get_mime_major} from '../services/files.js'
let MIMETYPE = CATEGORIES.FILES.SCHEMAS.FILE_INFO.props.mimetype.key

let DATA_CACHE = {}

function ImagePreview({file}) {
    let [data,setData] = useState(null)
    useEffect(()=>{
        if(file.props.meta) {
            let thumbs = file.props.meta.thumbs
            if(thumbs && thumbs.length > 0) {
                let url = calculate_thumb_url(file)
                console.log('the url is',url)
                setData(url)
                return
            }
        } else {
            generate_image_thumb(file, (url) => setData(url))
        }
    },[file])
    return <img className={'thumbnail'} src={data}/>
}

function generate_image_thumb(file, cb) {
    if(DATA_CACHE[file.props.url]) return cb(DATA_CACHE[file.props.url])

    console.log("loading image thumb",file.props.url)
    fetch(`${PROXY_SERVER_URL}?url=${file.props.url}`,{
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

function TextPreview({file}) {
    let [data,setData] = useState(null)
    useEffect(()=>{
        generate_text_thumb(file,(url)=> setData(url))
    },[file])
    return <span className={'thumbnail'}><b>preview</b> {data}</span>
}

function generate_text_thumb(file, cb) {
    if(DATA_CACHE[file.props.url]) return cb(DATA_CACHE[file.props.url])
    console.log("loading the text", file.props.url)
    fetch(`${PROXY_SERVER_URL}?url=${file.props.url}`,{
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


function AudioPreview({file}) {
    return <audio className={'thumbnail'} src={propAsString(file,'url')} controls={true}/>
}

export function FilePreview({file}) {
    let mimetype = propAsString(file,MIMETYPE)
    if(get_mime_major(file) === 'image') return <ImagePreview file={file}/>
    if(mimetype === 'text/plain') return <TextPreview file={file}/>
    if(mimetype === 'audio/mpeg') return <AudioPreview file={file}/>
    return <div className={'preview'}>no preview</div>
}

