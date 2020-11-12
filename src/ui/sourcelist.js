import React from 'react';
import Icon from '@material-ui/core/Icon'
import {HBox, Spacer, VBox} from './ui.js'
import {flatten} from './grid3layout.js'

import "./sourcelist.css"

export function SourceList({data, column, secondary, selected, renderItem}) {
    if(!data) {
        data = []
        for (let i = 0; i < 20; i++) {
            data.push(`line ${i}`)
        }
    }
    if(!renderItem) {
        renderItem = (item) => item
    }
    let cls = `source-list col${column}`
    if(secondary) cls += ' secondary'
    return <ul className={cls}>{data.map((o,i)=><SourceListItem key={i} selected={selected===o} item={o} renderItem={renderItem}/>)}</ul>
}

export function SourceListItem({item, selected, renderItem}) {
    let cls = flatten({
        selected:selected,
    })
    return <li className={cls}>{renderItem(item)}</li>
}

