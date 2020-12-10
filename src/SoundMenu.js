import React, {useState} from 'react'
import "./menus.css"

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

export function SoundMenu() {
    const [vol,set_vol] = useState(50)
    const [audio_inputs] = useState(()=>{
        return FAKE_AUDIO_INPUTS
    })
    const [audio_outputs] = useState(()=>{
        return FAKE_AUDIO_OUTPUTS
    })

    return <ul className={'menu'}>
        <li className={'header'}>Sound</li>
        <li>
            <input type="range"
                   min={0}
                   max={100}
                   value={vol} onChange={e => set_vol(e.target.value)}/>
        </li>
        <li className={'divider'}></li>
        <li className={'header'}>Output</li>
        {audio_outputs.map((o,i) => <li key={i} className={'action'}>{o.title}</li>)}
        <li className={'divider'}></li>
        <li className={'header'}>Input</li>
        {audio_inputs.map((o,i) => <li key={i} className={'action'}>{o.title}</li>)}
        <li className={'divider'}></li>
        <li className={'action'}>Sound Settings</li>
    </ul>
}