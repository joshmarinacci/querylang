import React from 'react'
import "../ui/themetester.css"
import {MenuBar, MenuBarButton, MenuDivider, MenuItem, MenuItemTriggerSub} from '../ui/ui.js'
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'

export default {
    title: 'QueryOS/Controls',
    component: MenuBar,
    argTypes: {}
}


export const SimpleMenuBar = () => {
    return <MenuBar>
        <MenuBarButton caption={'File'}>
            <MenuItem caption={'Before'}/>
            <MenuItemTriggerSub caption={'new'}>
                <MenuItem caption={'New File'}/>
                <MenuItem caption={'New Project'}/>
                <MenuItem caption={'New Directory'}/>
            </MenuItemTriggerSub>
            <MenuItem caption={'Open'}/>
            <MenuItem caption={'Close'}/>
            <MenuDivider/>
            <MenuItemTriggerSub caption={'import'}>
                <MenuItem caption={'... from File'}/>
                <MenuItemTriggerSub caption={'new'}>
                    <MenuItem caption={'New File'}/>
                    <MenuItem caption={'New Project'}/>
                    <MenuItem caption={'New Directory'}/>
                </MenuItemTriggerSub>
                <MenuItem caption={'... from Github'}/>
                <MenuItem caption={'... from External'}/>
            </MenuItemTriggerSub>
        </MenuBarButton>
        <MenuBarButton caption={'Edit'}>
            <MenuItem caption={'Cut'}/>
            <MenuItem caption={'Copy'}/>
            <MenuItem caption={'Paste'}/>
        </MenuBarButton>
        <MenuBarButton caption={'View'}></MenuBarButton>
        <MenuBarButton caption={'Help'}></MenuBarButton>
    </MenuBar>
}


