import React from 'react';
import {Spacer, Toolbar} from '../ui/ui.js'
import Icon from '@material-ui/core/Icon'

export default {
    title: 'QueryOS/Controls',
    component: Toolbar,
    argTypes: {
    },
};

export const ToolbarBasic = () => {
    return <Toolbar>
            <label>Inbox</label>
            <Spacer/>
            <Icon>filter_list</Icon>
        </Toolbar>
}
export const ToolbarWithButtons = () => {
    return <Toolbar column={3}>
        <Icon>email</Icon>
        <Icon>create</Icon>
        <Spacer/>
        <Icon>archive</Icon>
        <Icon>delete</Icon>
        <Spacer/>
        <Icon>search</Icon>
    </Toolbar>
}
