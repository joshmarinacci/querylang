import React, {useContext, useEffect, useState} from 'react'

import "./PopupManager.css"
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
            console.log("show popup!",payload,relative)
            let rect = relative.getBoundingClientRect()
            console.log(rect)
            setVisible(true)
            setPopup(payload)
            if(relative) setPosition(rect)
        }
        pm.addEventListener("show",handler)
        return () => {
            pm.removeEventListener("show",handler)
        }
    })

    return <div className={'popup-container'}
                style={{
                    left:position.x+"px",
                    top:position.y+"px",
                    visibility:visible,
                }}
    >popup container
        {popup}
    </div>
}

export const PopupManagerContext = React.createContext('popupmanager')