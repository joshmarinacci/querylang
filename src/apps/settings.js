import React, {useContext, useEffect, useRef, useState} from 'react'
import {DBContext, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {Window} from '../ui/window.js'
import {Toolbar, VBox} from '../ui/ui.js'
import {colors} from '@material-ui/core'

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
const ZOOM = 1
const W = 8
const H = 8
const bg = [50,150,150,255]
const fg = [240,240,240,255]
const color_to_rgba = (arr) => `rgb(${arr[0]},${arr[1]},${arr[2]})`

const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));

function draw_mini(mini,data) {
    let c = mini.getContext('2d')
    let id = c.getImageData(0,0,W,H)
    data.forEach((v,i)=>{
        let n = i*4;
        let color = bg
        if(v) color = fg
        id.data[n] = color[0]
        id.data[n+1] = color[1]
        id.data[n+2] = color[2]
        id.data[n+3] = color[3]
    })
    c.putImageData(id,0,0)
}
function BackgroundEditorPanel() {
    let mini = useRef()
    let [update,setUpdate] = useState(false)
    const refresh = () => setUpdate(!update)

    let [data] = useState(()=> {
        return range(0,W*H,1).map(v=>false)
    })
    useEffect(()=>{
        if(mini.current) {
            draw_mini(mini.current,data)
            let elem = document.querySelector("html")
            elem.style.backgroundImage = `url(${mini.current.toDataURL()})`
            elem.style.backgroundSize = `${W*ZOOM}px ${H*ZOOM}px`
        }
    },[update])

    return <div>
        <CanvasSurface update={update} data={data} onUpdate={refresh}/>
        <canvas width={W} height={H} ref={mini} style={{display:'none'}}/>
    </div>
}

function CanvasSurface({update, data, onUpdate, ...args}) {
    const [down, setDown] = useState(false)
    const [color, setColor] = useState(true)

    const getPenFromEvent = (e) => {
        let rect = e.target.getBoundingClientRect()
        let pos = {
            x:Math.floor((e.clientX-rect.x)/SCALE),
            y:Math.floor((e.clientY - rect.y)/SCALE)
        }
        let n = pos.y*W+pos.x
        return data[n]
    }

    const setPenFromEvent = (e, color) => {
        let rect = e.target.getBoundingClientRect()
        let pos = {
            x:Math.floor((e.clientX-rect.x)/SCALE),
            y:Math.floor((e.clientY - rect.y)/SCALE)
        }
        let n = pos.y*W+pos.x
        data[n] = color
    }

    const mouseDown = e => {
        let penColor = getPenFromEvent(e)
        setColor(!penColor)
        setPenFromEvent(e, !penColor)
        setDown(true)
        onUpdate()
    }

    const mouseMove = e => {
        if(down) {
            setPenFromEvent(e,color)
            onUpdate()
        }
    }
    const mouseUp = e => setDown(false)

    let canvas = useRef()

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
        for(let x=0; x<=W; x++) {
            c.moveTo(x*SCALE,0)
            c.lineTo(x*SCALE,h)
        }
        for(let y=0; y<=H; y++) {
            c.moveTo(0,y*SCALE)
            c.lineTo(w,y*SCALE)
        }
        c.stroke()

        data.forEach((v,i) => {
            let x = i%W;
            let y = Math.floor(i/W);
            c.fillStyle = color_to_rgba(v?fg:bg)
            c.fillRect(x*SCALE+1,y*SCALE+1,SCALE-2,SCALE-2)
        })

        c.restore()
    }

    useEffect(()=>{
        if(canvas.current) {
            draw(canvas.current,data)
        }
    },[update])
    return <canvas width={SCALE*W+1} height={SCALE*H+1} ref={canvas}
                   onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp}
                   {...args}/>
}