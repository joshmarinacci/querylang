import React, {useState} from 'react'
import {HBox, Toolbar, VBox} from '../ui/ui.js'
import {genid} from '../data.js'
import {flatten} from '../util.js'
import {FileBrowser} from '../ui/filebrowser.js'
import {DBContext, makeDB} from '../db.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import {Calendar} from '../apps/calendar.js'
import {CATEGORIES} from '../schema.js'

export default {
    title: 'QueryOS/FileBrowser',
    component: FileBrowser,
    argTypes: {
    },
};


function gen_local_files() {
    let data = []
    data.push({
        id:genid('file-meta'),
        category:CATEGORIES.FILES.ID,
        type:CATEGORIES.FILES.SCHEMAS.FILE_INFO.TYPE,
        props: {
            creation_date: new Date(2001),
            modified_date: new Date(2020,10),
            filename:'retro_beach.jpg',
            tags:['wallpaper'],
            mimetype:'image/jpeg',
            url:"https://apps.josh.earth/images/retro_beach.jpg",
            filesize:-1,
            type_info:{
                infotype:'image',
                width:1920,
                height:1080,
                format:'jpeg',
                thumbnails:{

                },
            },
            deleted:false,
        }
    })

    data.push({
        id:genid('file-meta'),
        category:CATEGORIES.FILES.ID,
        type:CATEGORIES.FILES.SCHEMAS.FILE_INFO.TYPE,
        props: {
            creation_date: new Date(2001),
            modified_date: new Date(2020,11),
            tags:['history'],
            mimetype:'image/jpeg',
            filename:'car_linaeus.jpg',
            url:"https://apps.josh.earth/images/car_linnaeus.jpg",
            filesize:-1,
            type_info:{
                infotype:'image',
                width:597,
                height:720,
                format:'jpeg',
                thumbnails:{

                },
            },
            deleted:false,
        }
    })

    data.push({
        id:genid('file-meta'),
        category:CATEGORIES.FILES.ID,
        type:CATEGORIES.FILES.SCHEMAS.FILE_INFO.TYPE,
        props: {
            creation_date: new Date(2001),
            modified_date: new Date(2020,11),
            tags:['history'],
            mimetype:'text/plain',
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
}



let db = makeDB()
let pm = new PopupManager()

export const FileBrowserSimple = () => {
    let [files,setFiles] = useState(()=>gen_local_files())
    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <FileBrowser files={files}/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>

}