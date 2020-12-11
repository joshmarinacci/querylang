import React from 'react';

import {Grid3Layout} from '../ui/grid3layout.js'
import {flatten} from '../util.js'
import {InfoBar, Spacer, Toolbar} from '../ui/ui.js'
import Icon from '@material-ui/core/Icon'
import {EmailFolder, EmailItem, gen_emails, gen_folders} from './email_example.js'
import {DataList} from '../ui/dataList.js'
import "../ui/themetester.css"

export default {
    title: 'QueryOS/Controls',
    component: Grid3Layout,
    argTypes: {
    },
};


function Panel({column=1, row=1, caption='caption'}) {
    let cls = {}
    cls['col'+column] = true
    cls['row'+row] = true

    return <div style={{
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
    }} className={flatten(cls)}>
        {caption}
    </div>
}

export const BasicGrid3Layout = () => {
    return <Grid3Layout>
        <Panel column={1} row={1} caption={'title'}/>
        <Panel column={1} row={2} caption={'source 1'}/>

        <Panel column={2} row={1} caption={'toolbar 1'}/>
        <Panel column={2} row={2} caption={'source 2'}/>

        <Panel column={3} row={1} caption={'toolbar 2'}/>
        <Panel column={3} row={2} caption={'content'}/>
    </Grid3Layout>
}


export const Grid3LayoutEmailExample = () => {
    let folders = gen_folders()
    let emails = gen_emails()
    return <Grid3Layout>
        <InfoBar title={'Cool App'}/>
        <DataList column={1} secondary data={folders}
                  selected={folders[1]}
                  renderItem={obj => <EmailFolder item={obj}/>}
        />

        <Toolbar>
            <label>Inbox</label>
            <Spacer/>
            <Icon>filter_list</Icon>
        </Toolbar>
        <DataList column={2} data={emails} selected={emails[1]}
                  renderItem={(obj)=> <EmailItem item={obj}/>}/>

        <Toolbar>
            <Icon>email</Icon>
            <Icon>create</Icon>
            <Spacer/>
            <Icon>archive</Icon>
            <Icon>delete</Icon>
            <Spacer/>
            <Icon>search</Icon>
        </Toolbar>

        <Panel column={3} row={2} caption={'content area'}/>

    </Grid3Layout>
}