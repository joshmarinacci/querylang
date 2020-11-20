import Icon from '@material-ui/core/Icon'
import {HBox, Spacer, VBox} from '../ui/ui.js'
import React from 'react'
import {propAsBoolean, propAsString} from '../db.js'
import {range} from '../util.js'
import faker from 'faker'

export function TitleBar({title}) {
    return <div className={'titlebar info'}>
        {/*<Icon>settings</Icon>*/}
        {/*<Spacer/>*/}
        {title}
    </div>
}

export function ContentArea({column}) {
    let cls = `content-area col${column}`
    return <div className={cls}>this is some big and cool content</div>
}


export function EmailFolder({item}){
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


export function EmailItem({item}) {
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


export function gen_folders() {
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
    return folders
}


export function gen_emails() {
    let emails = range(0,20,1).map((n)=>({
        id:n,
        props: {
            from: faker.name.findName(),
            subject: faker.lorem.sentence(),
            read:Math.random()<0.5,
            excerpt: faker.lorem.sentences(4).substring(0,100),
        }
    }))

    return emails
}