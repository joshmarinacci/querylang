import React, {useState} from 'react'
import "./menus.css"
import {MenuContainer, MenuDivider, MenuHeader, MenuItem, Spacer} from './ui/ui.js'

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

export function NetworkMenu({style={}}) {
    const [wireless] = useState(()=>{
        return FAKE_WIRELESS_NETWORKS
    })
    const [wired] = useState(()=>{
        return FAKE_OTHER_NETWORKS
    })

    const [selected_wifi, set_selected_wifi] = useState(FAKE_WIRELESS_NETWORKS[0])

    let items = []
    items.push(<MenuHeader caption={'Network'}/>)
    items.push(<li className={'header'}>
        <label>Wireless</label>
        <Spacer/>
        <button>Disable</button></li>)
    wireless.map((o,i) => {
        let sel = ((selected_wifi.title===o.title)?"selected":"")
        items.push(<MenuItem key={i} className={"action "+sel } caption={o.title}/>)
    })


    return <MenuContainer style={style}>
        {items}
        <MenuDivider/>
        <MenuHeader caption={'Wired'}/>
        {wired.map((o,i) => <MenuItem key={i} className={'action'} caption={o.title}/>)}
        <MenuDivider/>
        <MenuItem key={'network_settings'} caption={'Network Settings'}/>
    </MenuContainer>
}