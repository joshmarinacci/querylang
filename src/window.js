import React, {useEffect, useState} from 'react'
import Icon from '@material-ui/core/Icon'

export function Window({width,height,children,title, className, resize, hide_titlebar, appService, app, anchor="none"}) {

    let [dragging, setDragging] = useState(false)
    let [left,setLeft] = useState((title==="apps")?0:100)
    let [top,setTop] = useState(0)
    let [offx, setOffx] = useState(0)
    let [offy, setOffy] = useState(0)

    let [w,sw] = useState(width?width:100)
    let [h,sh] = useState(height?height:100)

    let [resizing, setResizing] = useState(false)

    let style = {
        width: `${w}px`,
        height: `${h}px`,
        position:'absolute',
        left:`${left-offx}px`,
        top:(top-offy)+'px',
    }
    if(anchor === "top-right"){
        style.left = null
        style.right = '0px'
        style.bottom = null
        style.top = '0px'
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
        ></label>

    }
    let title_ui = ""
    if(!title && app && app.props && app.props.title) {
        title = app.props.title
    }
    if(!hide_titlebar) {
        title_ui = <title onMouseDown={mouseDown}>
            <b>{title}</b>
            <Icon onClick={closeApp}>close</Icon>
        </title>
    }
    return <div className={"window " + className} style={style}>
        {title_ui}
        {children}
        {resize_handle}
    </div>
}

