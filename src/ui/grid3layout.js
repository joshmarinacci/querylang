import React from 'react';
import Icon from '@material-ui/core/Icon'

/*
 - draggable title bar
 - toolbar integrated with title bar or below it?
 - sidebar 1
 - sidebar 2
 - main content area
 - status bar
 - accent color
 - expands to fill the window
 - dialogs overlay and it turns gray

 */
import "./grid3layout.css"
import {HBox, Spacer, VBox} from './ui.js'

import faker from 'faker'
import {range} from '../util.js'
import {propAsBoolean, propAsString} from '../db.js'
let emails = range(0,20,1).map((n)=>({
    id:n,
    props: {
        from: faker.name.findName(),
        subject: faker.lorem.sentence(),
        read:Math.random()<0.5,
        excerpt: faker.lorem.sentences(4).substring(0,100),
    }
}))

let folders = [
    {
        id:'header1',
        props: {
            title:'Favorites',
            header:true,
        }
    },
    {
        id:'inbox',
        props: {
            title:'inbox',
            icon:'inbox',
            count:17,
        }
    },
    {
        id:'sent',
        props: {
            title:'sent',
            icon:'send',
            count:0,
        }
    },
    {
        id:'flagged',
        props: {
            title:'flag',
            icon:'flagged',
            count:0,
        }
    }
]


function EmailItem({item}) {
    return <VBox className={'email-item'}>
        <HBox>
            {/*<Icon className="small">{propAsBoolean(item,'read')?"brightness_1":""}</Icon>*/}
            <b className={'from'}>{propAsString(item,'from')}</b>
            <Spacer/>
            <label className={'time'}>2:00AM</label>
        </HBox>
        <HBox>
            <i className={'subject'}>{propAsString(item,'subject')}</i>
            <Spacer/>
            <Icon className="small">attachment</Icon>
        </HBox>
        <HBox>
            <p className={'excerpt'}>{propAsString(item,'excerpt')}</p>
        </HBox>
    </VBox>
}

function EmailFolder({item}){
    if(propAsBoolean(item,'header')) {
        return <HBox className="folder header">
            {propAsString(item,'title')}
        </HBox>
    }

    let badge = ""
    if(item.props.count) {
        badge = <span className={'badge'}>{item.props.count}</span>
    }

    return <HBox className="folder">
        <Icon className={'icon'}>{propAsString(item,'icon')}</Icon>
        <span className={'title'}>{propAsString(item,'title')}</span>
        <Spacer/>
        {badge}
    </HBox>
}
export function Grid3Layout({}) {
    return <div className={'grid3layout'}>
        <TitleBar title={'Cool App'}/>
        <SourceList column={1} secondary data={folders}
                    selected={folders[1]}
                    renderItem={obj => <EmailFolder item={obj}/>}
        />

        <TopToolbar column={2}>
            <label>Inbox</label>
            <Spacer/>
            <Icon>filter_list</Icon>
        </TopToolbar>
        <SourceList column={2} data={emails} selected={emails[1]}
                    renderItem={(obj)=> <EmailItem item={obj}/>}/>

        <TopToolbar column={3}>
            <Icon>email</Icon>
            <Icon>create</Icon>
            <Spacer/>
            <Icon>archive</Icon>
            <Icon>delete</Icon>
            <Spacer/>
            <Icon>search</Icon>
        </TopToolbar>
        <ContentArea column={3}/>
    </div>
}

export const flatten = (obj) => {
    let str = ""
    Object.keys(obj).forEach(k => str += obj[k]?(k + " "):"")
    return str
}


function TitleBar({title}) {
    return <div className={'titlebar'}>
        <Icon>settings</Icon>
        <Spacer/>
        {title}
    </div>
}
function SourceList({data, column, secondary, selected, renderItem}) {
    if(!data) {
        data = []
        for (let i = 0; i < 20; i++) {
            data.push(`line ${i}`)
        }
    }
    if(!renderItem) {
        renderItem = () => "item"
    }
    let cls = `source-list col${column}`
    if(secondary) cls += ' secondary'
    return <ul className={cls}>{data.map((o,i)=><SourceListItem key={i} selected={selected===o} item={o} renderItem={renderItem}/>)}</ul>
}
function SourceListItem({item, selected, renderItem}) {
    let cls = flatten({
        selected:selected,
    })
    return <li className={cls}>{renderItem(item)}</li>
}
function TopToolbar({column, children}) {
    let cls = `toolbar col${column}`
    return <div className={cls}>
        {children}
    </div>
}
function ContentArea({column}) {
    let cls = `content-area col${column}`
    return <div className={cls}>this is some big and cool content</div>
}