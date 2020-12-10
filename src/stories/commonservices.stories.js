import React from 'react';
import "../ui/themetester.css"
import {NetworkMenu} from '../NetworkMenu.js'
import {SoundMenu} from '../SoundMenu.js'

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

