import React, {useContext, useEffect, useState} from 'react'
import "./menus.css"
import {Spacer} from './ui/ui.js'

let FAKE_WIRELESS_NETWORKS = [
    {
        title:'Home Wifi',
    },
    {
        title:`Neighbor's Wifi`
    },
    {
        title:'Rogue wifi, dont connecct'
    }
]

let FAKE_OTHER_NETWORKS = [
    {
        title:'Ethernet'
    },
]

export function NetworkMenu() {
    const [wireless] = useState(()=>{
        return FAKE_WIRELESS_NETWORKS
    })
    const [wired] = useState(()=>{
        return FAKE_OTHER_NETWORKS
    })

    const [selected_wifi, set_selected_wifi] = useState(FAKE_WIRELESS_NETWORKS[0])

    let items = []
    items.push(<li className={'header'}>Network</li>)
    items.push(<li className={'header'}>
        <label>Wireless</label>
        <Spacer/>
        <button>Disable</button></li>)
    wireless.map((o,i) => {
        items.push(<li key={i} className={"action "+ ((selected_wifi.title===o.title)?"selected":"")}>{o.title}</li>)
    })


    return <ul className={'menu'}>{items}
        <li className={'divider'}></li>
        <li className={'header'}>Wired</li>
        {wired.map((o,i) => <li key={i} className={'action'}>{o.title}</li>)}
        <li className={'divider'}></li>
        <li className={'action'}>Network Settings</li>
    </ul>
}