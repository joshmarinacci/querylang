import {propAsString} from '../db.js'
import React, {useEffect, useState} from 'react'
import {CATEGORIES} from '../schema.js'
let MIMETYPE = CATEGORIES.FILES.SCHEMAS.FILE_INFO.props.mimetype.key
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
let DATA_CACHE = {}

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


export function FilePreview({file}) {
    let preview = ""
    let thumb = useThumbnail(file)
    if(propAsString(file,MIMETYPE) === 'image/jpeg') preview = <img className={'thumbnail'} src={thumb} alt={"image preview"}/>
    if(propAsString(file,'mimetype' )=== 'text/plain')  preview = <span className={'thumbnail'}><b>preview</b> {thumb}</span>
    return <div className={'preview'}>{preview}</div>
}

