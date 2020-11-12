import React from 'react';
import Icon from '@material-ui/core/Icon'
import {HBox, Spacer, VBox} from './ui.js'
import {flatten} from './grid3layout.js'

import "./sourcelist.css"
import {propAsString} from '../db.js'

export function SourceList({data, column, secondary, selected, renderItem, setSelected}) {
    if(!data) {
        data = []
        for (let i = 0; i < 20; i++) {
            data.push(`line ${i}`)
        }
    }
    if(!renderItem) {
        renderItem = (item) => item.toString()
    }
    let cls = `source-list col${column}`
    if(secondary) cls += ' secondary'
    return <ul className={cls}>{data.map((o,i)=><SourceListItem key={i} selected={selected} item={o} renderItem={renderItem} setSelected={setSelected}/>)}</ul>
}

export function SourceListItem({item, selected, renderItem, setSelected}) {
    let cls = flatten({
        selected:(selected && selected.id === item.id),
    })
    return <li className={cls} onClick={()=>{
        if(setSelected) setSelected(item)
    }}>{renderItem(item)}</li>
}

export function StandardSourceItem({title, subtitle, icon, onDoubleClick}) {
    return <HBox className="folder" center onDoubleClick={onDoubleClick}>
        <Icon className={'icon'}>{icon}</Icon>
        <VBox>
            {title?<span className={'title'}>{title}</span>:""}
            {subtitle?<span className={'subtitle'}>{subtitle}</span>:""}
        </VBox>
    </HBox>

}