import React, {useContext, useEffect, useState} from 'react'

import "./PopupManager.css"
import {flatten} from '../util.js'
export class PopupManager {
    constructor() {
        this.listeners = []
    }

    addEventListener(type, l) {
        this.listeners.push(l)
    }
    removeEventListener(type, l) {
        this.listeners = this.listeners.filter(ll => ll !== l)
    }

    show(elem,relative) {
        this.listeners.forEach(l => l(elem,relative))
    }
    hide() {
        this.listeners.forEach(l => l(null))
    }

}

export function PopupContainer ({}) {
    let pm = useContext(PopupManagerContext)
    let [visible,setVisible] = useState(false)
    let [popup,setPopup] = useState(null)
    let [position, setPosition] = useState(new DOMRect(0,0,10,10))
    useEffect(()=>{
        let handler = (payload,relative) => {
            if(payload) {
                setVisible(true)
                setPopup(payload)
                if (relative) {
                    let rect = relative.getBoundingClientRect()
                    setPosition(new DOMRect(rect.x, rect.bottom, 10, 10))
                }
            } else {
                setVisible(false)
                setPopup(null)
            }
        }
        pm.addEventListener("show",handler)
        return () => {
            pm.removeEventListener("show",handler)
        }
    })

    // console.log("rendering popup container", visible)
    let cls = {
        'popup-container':true,
        visible:visible
    }
    let style = {
        left:position.x+"px",
        top:position.y+"px",
    }
    return <div className={flatten(cls)} style={style}>
        {popup}
    </div>
}

export const PopupManagerContext = React.createContext('popupmanager')