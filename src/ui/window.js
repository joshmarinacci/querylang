import React, {useContext, useEffect, useState} from 'react'
import Icon from '@material-ui/core/Icon'
import {propAsString} from '../db.js'
import {AppLauncherContext} from '../services/AppLauncherService.js'
import "./window.css"

export function Window({children, resize=true, hide_titlebar=false, app, anchor="none",}) {
    let appService = useContext(AppLauncherContext)
    let wm = useContext(WindowManagerContext)
    let title = propAsString(app,'title')
    // console.log("making window for app",app)
    let width = 800
    if(app && app.props.window && app.props.window.default_width) {
        width = app.props.window.default_width
    }
    let height = 400
    if(app && app.props.window && app.props.window.default_height) {
        height = app.props.window.default_height
    }
    if(app && app.props.window && app.props.window.anchor) {
        anchor = app.props.window.anchor
    }
    if(app && app.props.window && app.props.window.hide_titlebar) {
        hide_titlebar = app.props.window.hide_titlebar
    }
    if(app && app.props.window && 'resize' in app.props.window) {
        resize = app.props.window.resize
    }

    let className = ""
    if(app) {
        className = propAsString(app,'appid')
    }

    let [dragging, setDragging] = useState(false)
    let [left,setLeft] = useState((title==="apps")?0:100)
    let [top,setTop] = useState(40)
    let [offx, setOffx] = useState(0)
    let [offy, setOffy] = useState(0)

    let [w,sw] = useState(width?width:100)
    let [h,sh] = useState(height?height:100)

    let [resizing, setResizing] = useState(false)
    let [z, setZ] = useState(1)

    let style = {
        width: `${w}px`,
        height: `${h}px`,
        position:'absolute',
        left:`${left-offx}px`,
        top:(top-offy)+'px',
        zIndex: z,
    }
    if(anchor === "top-right"){
        style.left = null
        style.right = '0px'
        style.bottom = null
        style.top = '0px'
    }
    if(anchor === "top-left"){
        style.left = '0px'
        style.right = null
        style.bottom = null
        style.top = '0px'
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

    const closeApp = () => appService.close(app)

    let resize_handle = ""
    if(resize) {
        resize_handle = <label className={'resize-handle'}
                               onMouseDown={resize_mouse_down}
        />

    }
    let title_ui = ""
    if(!title && app && app.props && app.props.title) {
        title = app.props.title
    }
    if(!hide_titlebar) {
        title_ui = <title onMouseDown={mouseDown}>
            <Icon className={'appicon'}>{app.props.icon}</Icon>
            <b>{title}</b>
            <Icon onClick={closeApp} className={'close'}>close</Icon>
        </title>
    }
    return <div className={"window " + className} style={style}>
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

