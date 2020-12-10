import React from 'react';
import "../ui/themetester.css"
import {NetworkMenu} from '../apps/systembar/NetworkMenu.js'
import {SoundMenu} from '../apps/systembar/SoundMenu.js'

export default {
    title: 'QueryOS/Services',
    component: NetworkMenu,
    argTypes: {
    },
};


export const NetworkMenuSimple = () => {
    return <NetworkMenu style={{maxWidth:'15em'}}/>
}
export const SoundMenuSimple = () => {
    return <SoundMenu style={{maxWidth:'15em'}}/>
}

