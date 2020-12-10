import React from 'react'
import "../ui/themetester.css"
import {MenuBar, MenuBarButton, MenuContainer, MenuDivider, MenuItem, MenuItemTriggerSub} from '../ui/ui.js'

export default {
    title: 'QueryOS/Controls',
    component: MenuBar,
    argTypes: {}
}


export const SimpleMenuBar = () => {
    return <MenuBar>
        <MenuBarButton caption={'File'}>
            <MenuContainer>
                <MenuItem caption={'Before'}/>
                <MenuItemTriggerSub caption={'new'}>
                    <MenuContainer>
                    <MenuItem caption={'New File'}/>
                    <MenuItem caption={'New Project'}/>
                    <MenuItem caption={'New Directory'}/>
                    </MenuContainer>
                </MenuItemTriggerSub>
                <MenuItem caption={'Open'}/>
                <MenuItem caption={'Close'}/>
                <MenuDivider/>
                <MenuItemTriggerSub caption={'import'}>
                    <MenuContainer>
                        <MenuItem caption={'... from File'}/>
                        <MenuItemTriggerSub caption={'new'}>
                            <MenuContainer>
                                <MenuItem caption={'New File'}/>
                                <MenuItem caption={'New Project'}/>
                                <MenuItem caption={'New Directory'}/>
                            </MenuContainer>
                        </MenuItemTriggerSub>
                        <MenuItem caption={'... from Github'}/>
                        <MenuItem caption={'... from External'}/>
                    </MenuContainer>
                </MenuItemTriggerSub>
            </MenuContainer>
        </MenuBarButton>
        <MenuBarButton caption={'Edit'}>
            <MenuContainer>
                <MenuItem caption={'Cut'}/>
                <MenuItem caption={'Copy'}/>
                <MenuItem caption={'Paste'}/>
            </MenuContainer>
        </MenuBarButton>
        <MenuBarButton caption={'View'}></MenuBarButton>
        <MenuBarButton caption={'Help'}></MenuBarButton>
    </MenuBar>
}


