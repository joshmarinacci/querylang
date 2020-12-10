import React, {useContext} from 'react'
import {DictionaryPanel} from './DictionaryPanel'
import {ViewImagePanel} from './ViewImagePanel.js'
import {WebpageScanResultsPanel} from "./WebpageScanResultsPanel.js"
import {AppLauncherContext} from '../services/AppLauncherService.js'
import {WeatherPanel} from './WeatherPanel.js'

const PANELS = {
    DictionaryPanel:DictionaryPanel,
    ViewImagePanel:ViewImagePanel,
    WebpageScanResultsPanel:WebpageScanResultsPanel,
    WeatherPanel:WeatherPanel,
}

export function PanelViewerApp({instance}) {
    let svc = useContext(AppLauncherContext)
    let ThePanel = PANELS[instance.args.panel_func]
    return <ThePanel args={instance.args} onClose={()=> svc.close(instance)}/>
}