import React, {useContext, useEffect, useState} from 'react'

// import "./PopupManager.css"
import {flatten} from '../util.js'
export class DialogManager {
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

export function DialogContainer ({}) {
    let pm = useContext(DialogManagerContext)
    let [visible,setVisible] = useState(false)
    let [dialog,setDialog] = useState(null)
    let [position, setPosition] = useState(new DOMRect(0,0,10,10))
    useEffect(()=>{
        let handler = (payload,relative) => {
            if(payload) {
                setVisible(true)
                setDialog(payload)
                if (relative) {
                    let rect = relative.getBoundingClientRect()
                    setPosition(new DOMRect(rect.x, rect.bottom, 10, 10))
                }
            } else {
                setVisible(false)
                setDialog(null)
            }
        }
        pm.addEventListener("show",handler)
        return () => {
            pm.removeEventListener("show",handler)
        }
    })

    // console.log("rendering popup container", visible)
    let cls = {
        'dialog-container':true,
        visible:visible
    }
    let style = {
        left:position.x+"px",
        top:position.y+"px",
        position:'fixed',
    }
    return <div className={"dialog-wrapper"} style={{
        zIndex:10000,
        position:'fixed',
        width: '100vw',
        height: '100vh',
        display:visible?'block':'none',
        backgroundColor:'rgba(255,255,255,0.5)',
    }}
                onClick={()=>{
                    // setVisible(false)
                    // setDialog(null)
                }}
    >
        <div className={flatten(cls)} style={style}>
            {dialog}
        </div>
    </div>
}

export const DialogManagerContext = React.createContext('dialogmanager')