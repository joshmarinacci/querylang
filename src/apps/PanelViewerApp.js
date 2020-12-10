import React, {useContext} from 'react'
import {DictionaryPanel} from './DictionaryPanel'
import {ViewImagePanel} from './ViewImagePanel.js'
import {WebpageScanResultsPanel} from "./WebpageScanResultsPanel.js"
import {AppLauncherContext} from '../services/AppLauncherService.js'

const PANELS = {
    DictionaryPanel:DictionaryPanel,
    ViewImagePanel:ViewImagePanel,
    WebpageScanResultsPanel:WebpageScanResultsPanel
}

export function PanelViewerApp({instance}) {
    let al = useContext(AppLauncherContext)
    let ThePanel = PANELS[instance.args.panel_func]
    return <ThePanel args={instance.args} onClose={()=>{
        al.close(instance)
    }}/>
}