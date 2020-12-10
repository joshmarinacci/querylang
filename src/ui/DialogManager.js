import React, {useContext, useEffect, useState} from 'react'

// import "./PopupManager.css"
import "./dialogmanager.css"
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
    useEffect(()=>{
        let handler = (payload) => {
            if(payload) {
                setVisible(true)
                setDialog(payload)
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
    return <div className={"dialog-wrapper"} style={{visibility:visible?'visible':'hidden' }}
                onClick={()=>{
                    // setVisible(false)
                    // setDialog(null)
                }}
    >
        <div className={"dialog-container"}>{dialog}</div>
    </div>
}

export const DialogManagerContext = React.createContext('dialogmanager')