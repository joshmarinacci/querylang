import React, {useContext} from 'react'
import {HBox, Spacer, VBox} from '../ui/ui.js'

export function CalculatorPanel({args, onClose}) {
    console.log("args are",args)
    return <VBox>
        query is
        answer is
        <Spacer/>
        <button onClick={onClose}>close</button>
    </VBox>
}