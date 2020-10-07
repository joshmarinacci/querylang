import React from 'react'

export function HBox ({children, grow}) {
    return <div className={'hbox ' + (grow?"grow":"")}>{children}</div>
}
export function VBox ({children, grow}) {
    return <div className={'vbox ' + (grow?"grow":"")}>{children}</div>
}
export function Panel({children, grow}) {
    return <div className={'panel ' + (grow?"grow":"")}>{children}</div>
}
export function Window({x,y,width,height,children,title}) {
    let style = {
        width: width ? (width + "px") : "100px",
        height: height ? (height + "px") : "100px",
        position:'absolute',
        left:x?(x+'px'):'0px',
        top:y?(y+'px'):'0px',
    }
    return <div className={"window"} style={style}>
        <title>{title}</title>
        {children}</div>
}
