import React, {useState} from 'react'
import {HBox, Toolbar, VBox} from '../ui/ui.js'
import {genid} from '../data.js'
import {flatten} from '../util.js'
import {FILE_INFO, FileBrowser, FILES} from '../ui/filebrowser.js'

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
        category:FILES,
        type:FILE_INFO,
        props: {
            creation_date: new Date(2001),
            modified_date: new Date(2020,10),
            filename:'retro_beach.jpg',
            tags:['wallpaper'],
            mimetype_major:'image',
            mimetype_minor:'jpeg',
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
        category:FILES,
        type:FILE_INFO,
        props: {
            creation_date: new Date(2001),
            modified_date: new Date(2020,11),
            tags:['history'],
            mimetype_major:'image',
            mimetype_minor:'jpeg',
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
}



export const FileBrowserSimple = () => {
    let files = useState(()=>gen_local_files())
    return <FileBrowser files={files}/>
}