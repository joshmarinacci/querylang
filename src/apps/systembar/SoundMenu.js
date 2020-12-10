import React, {useState} from 'react'
import "../../ui/menus.css"
import {MenuContainer, MenuDivider, MenuHeader, MenuItem} from '../../ui/ui.js'

let FAKE_AUDIO_OUTPUTS = [
    {
        title:'Internal Speakers',
    },
    {
        title:`Josh's Air Pods`
    },
    {
        title:'50in TCL Roku TV'
    }
]

let FAKE_AUDIO_INPUTS = [
    {
        title:'Internal Microphone'
    },
    {
        title:`Josh's Air Pods`
    },
    {
        title:`USB Microphone`
    }
]

export function SoundMenu({style={}}) {
    const [vol,set_vol] = useState(50)
    const [audio_inputs] = useState(()=>{
        return FAKE_AUDIO_INPUTS
    })
    const [audio_outputs] = useState(()=>{
        return FAKE_AUDIO_OUTPUTS
    })

    return <MenuContainer style={style}>
        <MenuHeader caption={'Sound'}/>
        <li>
            <input type="range"
                   min={0}
                   max={100}
                   value={vol} onChange={e => set_vol(e.target.value)}/>
        </li>
        <MenuDivider/>
        <MenuHeader caption={'Output'}/>
        {audio_outputs.map((o,i) => <MenuItem key={i} className={'action'} caption={o.title}/>)}
        <MenuDivider/>
        <MenuHeader caption={'Input'}/>
        {audio_inputs.map((o,i) => <MenuItem key={i} className={'action'} caption={o.title}/>)}
        <MenuDivider/>
        <MenuItem key={'sound_settings'} caption={'Sound Settings'}/>
    </MenuContainer>
}