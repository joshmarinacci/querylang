import React, {useContext} from 'react'
import {DictionaryPanel} from './DictionaryPanel.js'
import {ViewImagePanel} from './ViewImagePanel.js'
import {WebpageScanResultsPanel} from "./WebpageScanResultsPanel.js"
import {AppLauncherContext} from '../services/AppLauncherService.js'
import {WeatherPanel} from './WeatherPanel.js'
import {CalculatorPanel} from "./CalculatorPanel.js"

const PANELS = {
    DictionaryPanel:DictionaryPanel,
    ViewImagePanel:ViewImagePanel,
    WebpageScanResultsPanel:WebpageScanResultsPanel,
    WeatherPanel:WeatherPanel,
    CalculatorPanel:CalculatorPanel,
}

export function PanelViewerApp({instance}) {
    let svc = useContext(AppLauncherContext)
    if(!instance.args.panel_func) console.error("PanelViewerApp missing panel_func argument")
    let ThePanel = PANELS[instance.args.panel_func]
    return <ThePanel args={instance.args} onClose={()=> svc.close(instance)}/>
}