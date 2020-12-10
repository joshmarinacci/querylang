import React from 'react'
import "../ui/themetester.css"
import {MenuBar, MenuBarButton, MenuDivider, MenuItem, MenuItemTriggerSub} from '../ui/ui.js'
import {SystemBar} from '../apps/systembar/systembar.js'

export default {
    title: 'QueryOS/Apps',
    component: SystemBar,
    argTypes: {}
}

export const MainSystemBar = () => {
    return <SystemBar/>
}

