import React, {useContext, useEffect, useRef, useState} from 'react'
import {DBContext, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {Window} from '../ui/window.js'
import {Toolbar, VBox} from '../ui/ui.js'

export function SettingsApp({app}) {
    let db = useContext(DBContext)
    useDBChanged(db, CATEGORIES.TASKS.ID)
    let [panel,setPanel] = useState("background")
    return <Window app={app}>
        <VBox scroll>
            <Toolbar>
                <button onClick={()=>setPanel("background")}>background</button>
            </Toolbar>
            {renderPanel(panel)}
        </VBox>
    </Window>
}



function renderPanel(panel) {
    if(panel === 'background') {
        return <BackgroundEditorPanel/>
    }
    return <div>nothing</div>
}

const SCALE = 32

function draw(canvas, data) {
    let c = canvas.getContext('2d')
    let w = canvas.width
    let h = canvas.height
    c.fillStyle = 'white'
    c.fillRect(0,0,w,h)

    c.save()
    c.translate(0.5,0.5)

    c.strokeStyle = 'black';
    c.beginPath()
    for(let x=0; x<=8; x++) {
        c.moveTo(x*SCALE,0)
        c.lineTo(x*SCALE,h)
    }
    for(let y=0; y<=8; y++) {
        c.moveTo(0,y*SCALE)
        c.lineTo(w,y*SCALE)
    }
    c.stroke()

    data.forEach((v,i) => {
        let x = i%8;
        let y = Math.floor(i/8);
        if(v) {
            c.fillStyle = 'green'
        } else {
            c.fillStyle = 'white'
        }
        c.fillRect(x*32+1,y*32+1,32-2,32-2)
    })

    c.restore()
}
function BackgroundEditorPanel() {
    let canvas = useRef()
    let [update,setUpdate] = useState(false)
    const refresh = () => setUpdate(!update)

    let [data] = useState(()=> {
        let arr = []
        for(let i=0; i<(8*8); i++) {
            arr.push(false)
        }
        return arr
    })
    useEffect(()=>{
        if(canvas.current) {
            draw(canvas.current,data)
        }
    },[update])

    const clicked = e => {
        let rect = e.target.getBoundingClientRect()
        let pos = {
            x:Math.floor((e.clientX-rect.x)/32),
            y:Math.floor((e.clientY - rect.y)/32)
        }
        let n = pos.y*8+pos.x
        data[n] = !data[n]
        refresh()
    }
    return <div>
        <canvas width={32*8+1} height={32*8+1} ref={canvas} onClick={clicked}/>
    </div>
}
