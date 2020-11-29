import React, {Component} from 'react'
import {DictionaryPanel} from './DictionaryPanel'

export class PanelViewerApp extends Component {
    constructor(props) {
        super(props);
        this.panels = {
            DictionaryPanel:DictionaryPanel,
        }
    }
    render() {
        let app = this.props.app
        console.log("launching panel with args",app.launch_args)
        let ThePanel = this.panels[app.launch_args.panel_func]
        return <ThePanel args={app.launch_args}/>
    }
}

// export function PanelViewerApp({app}) {
//     const FuncName = app.launch_args.panel_func
// }