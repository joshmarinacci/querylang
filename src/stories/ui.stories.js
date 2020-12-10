import React from 'react';
import {Spacer, TopToolbar} from '../ui/ui.js'
import Icon from '@material-ui/core/Icon'

export default {
    title: 'QueryOS/Controls',
    component: TopToolbar,
    argTypes: {
    },
};

export const TopToolbarBasic = () => {
    return <TopToolbar column={2}>
            <label>Inbox</label>
            <Spacer/>
            <Icon>filter_list</Icon>
        </TopToolbar>
}
export const TopToolbarWithButtons = () => {
    return <TopToolbar column={3}>
        <Icon>email</Icon>
        <Icon>create</Icon>
        <Spacer/>
        <Icon>archive</Icon>
        <Icon>delete</Icon>
        <Spacer/>
        <Icon>search</Icon>
    </TopToolbar>
}
