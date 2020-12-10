import React, {useState} from 'react'

import {Grid3Layout} from '../ui/grid3layout.js'
import {SourceList} from '../ui/sourcelist.js'

import "./DataList.stories.css"
import {EmailFolder, EmailItem, gen_emails, gen_folders} from './email_example.js'

export default {
    title: 'QueryOS/Controls',
    component: SourceList,
    argTypes: {
    },
};

const Template = (args) => <Grid3Layout {...args} />;

export const DefaultSourceList = () => {
    return <SourceList/>
}


export const EmailItemSourceList = () => {
    let [emails] = useState(()=>gen_emails())
    const [selected,setSelected] = useState({})
    return <SourceList data={emails} selected={selected} setSelected={setSelected}
                       renderItem={(obj)=> <EmailItem item={obj}/>}/>
}


export const EmailFolderSourceList = () => {
    let [folders] = useState(()=>gen_folders())
    const [selected,setSelected] = useState({})
    return <SourceList data={folders}
                       selected={selected}
                       setSelected={setSelected}
                       renderItem={obj => <EmailFolder item={obj}/>}
    />
}