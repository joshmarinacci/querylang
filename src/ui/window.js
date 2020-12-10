import React, {useContext, useEffect, useState} from 'react'
import Icon from '@material-ui/core/Icon'
import {hasProp, propAsString} from '../db.js'
import {AppLauncherContext} from '../services/AppLauncherService.js'
import "./window.css"

function get_val(instance, name, backup) {
    if(instance.app && instance.app.props.window && instance.app.props.window[name]) {
        return instance.app.props.window[name]
    }
    return backup
}

export function Window({children, resize=true, hide_titlebar=false, instance, anchor="none",}) {
    let appService = useContext(AppLauncherContext)
    let wm = useContext(WindowManagerContext)
    let title = propAsString(instance.app,'title')
    // console.log("updating window for app",instance.id, instance.app.props.appid)

    let width = get_val(instance,'default_width',800)
    let height = get_val(instance,'default_height',400)
    anchor = get_val(instance,'anchor','none')
    hide_titlebar = get_val(instance,'hide_titlebar',false)
    resize = get_val(instance,'resize',true)
    let back_draggable = get_val(instance,'back_draggable',false)
    let overflow = get_val(instance, 'overflow','auto')
    let className = ""
    if(instance.app) className = propAsString(instance.app,'appid')

    let [dragging, setDragging] = useState(false)
    let [left,setLeft] = useState((title==="apps")?0:100)
    let [top,setTop] = useState(50)
    let [offx, setOffx] = useState(0)
    let [offy, setOffy] = useState(0)

    let [w,sw] = useState(width?width:100)
    let [h,sh] = useState(height?height:100)

    let [resizing, setResizing] = useState(false)
    let layer = 100;
    if(hasProp(instance.app,'layer')) {
        layer = instance.app.props.layer
    }
    let [z, setZ] = useState(layer)

    const maximize = () => {
        setLeft(70)
        setTop(50)
        sw(window.innerWidth-70-100)
        sh(window.innerHeight-50-5)
        console.log(window.innerWidth, window.innerHeight)
    }

    let style = {
        width: `${w}px`,
        height: `${h}px`,
        position:'absolute',
        left:`${left-offx}px`,
        top:(top-offy)+'px',
        zIndex: z,
        overflow: overflow,
    }
    if(anchor === "top-left"){
        style.left = '0px'
        style.right = null
        style.bottom = null
        style.top = '40px'
    }
    if(anchor === "top"){
        style.left = "0px"
        style.right = '0px'
        style.bottom = null
        style.top = '1px'
    }
    if(anchor === 'center') {
        style.left = '20vw';
        style.right = '20vw';
        style.width = 'auto'
        style.height = 'auto'
    }
    if(anchor === "top-right"){
        style.left = null
        style.right = '0px'
        style.bottom = null
        style.top = '40px'
    }
    if(anchor === "bottom-right"){
        style.left = null
        style.right = '0px'
        style.bottom = '0px'
        style.top = null
    }
    if(anchor === "bottom-left"){
        style.left = '0px'
        style.right = null
        style.bottom = '0px'
        style.top = null
    }
    if(!className) className = ""


    const mouseMove = (e) => {
        setLeft(e.screenX)
        setTop(e.screenY)
    }
    const mouseUp = () => {
        setLeft(left-offx)
        setOffx(0)
        setTop(top-offy)
        setOffy(0)
        setDragging(false)
    }
    useEffect(()=>{
        if(dragging) {
            window.addEventListener('mousemove',mouseMove)
            window.addEventListener('mouseup',mouseUp)
        }
        return ()=>{
            window.removeEventListener('mousemove', mouseMove)
            window.removeEventListener('mouseup',mouseUp)
        }
    })
    const mouseDown = (e) => {
        setOffx(e.screenX - left)
        setLeft(e.screenX)
        setOffy(e.screenY - top)
        setTop(e.screenY)
        setDragging(true)
        setZ(wm.raise(z))
    }

    const resize_mouse_down = (e) => {
        e.stopPropagation()
        setResizing(true)
    }

    const resize_mouse_move = (e) => {
        sw(e.pageX-left)
        sh(e.pageY - top)
    }
    const resize_mouse_up = (e) => {
        setResizing(false)
    }

    useEffect(()=>{
        if(resizing) {
            window.addEventListener('mousemove',resize_mouse_move)
            window.addEventListener('mouseup',resize_mouse_up)
        }
        return ()=>{
            window.removeEventListener('mousemove', resize_mouse_move)
            window.removeEventListener('mouseup',resize_mouse_up)
        }
    })


    if(dragging) className += " dragging "
    if(resizing) className += " resizing "
    if(back_draggable) className += " back-draggable"

    const closeApp = () => appService.close(instance)

    let resize_handle = ""
    if(resize) {
        resize_handle = <label className={'resize-handle'}
                               onMouseDown={resize_mouse_down}
        />

    }
    let title_ui = ""
    if(!hide_titlebar) {
        title_ui = <title onMouseDown={mouseDown}>
            <Icon className={'maximize'} onClick={maximize}>maximize</Icon>
            <Icon className={'appicon'}>{instance.app.props.icon}</Icon>
            <b>{title}</b>
            <Icon onClick={closeApp} className={'close'}>close</Icon>
        </title>
    }
    return <div className={"window " + className} style={style} onMouseDown={(e)=>{
        if(back_draggable) mouseDown(e)
    }}>
        {title_ui}
        {children}
        {resize_handle}
    </div>
}



export class WindowManager {
    constructor() {
        this.max = 10
    }
    raise() {
        this.max++
        return this.max
    }
}

export const WindowManagerContext = React.createContext('wm')

