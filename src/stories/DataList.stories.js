import React from 'react';

import {Grid3Layout} from '../ui/grid3layout.js'
import {SourceList} from '../ui/sourcelist.js'
import {range} from '../util.js'
import faker from 'faker'
import {HBox, Spacer, VBox} from '../ui/ui.js'
import {propAsBoolean, propAsString} from '../db.js'
import Icon from '@material-ui/core/Icon'

import "./DataList.stories.css"
import {EmailFolder, EmailItem, gen_emails, gen_folders} from './email_example.js'

export default {
    title: 'QueryOS/SourceList',
    component: SourceList,
    argTypes: {
    },
};

const Template = (args) => <Grid3Layout {...args} />;

export const DefaultSourceList = () => {
    return <SourceList/>
}


export const EmailItemSourceList = () => {
    let emails = gen_emails()
    return <SourceList data={emails} selected={emails[1]}
                       renderItem={(obj)=> <EmailItem item={obj}/>}/>
}


export const EmailFolderSourceList = () => {
    let folders = gen_folders()
    return <SourceList data={folders}
                       selected={folders[1]}
                       renderItem={obj => <EmailFolder item={obj}/>}
    />
}