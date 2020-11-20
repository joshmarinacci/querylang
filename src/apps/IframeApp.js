import React, {useContext, useEffect, useRef, useState} from 'react'
import {DBContext, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'

export function IFrameApp({app}) {
    let url ="https://vr.josh.earth/webxr-simgame/2dgame.html"
    let style = {
        flex:'1.0',
    }
    return <iframe src={url} style={style}></iframe>

}
