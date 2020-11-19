import React from 'react';
import Icon from '@material-ui/core/Icon'
import {HBox, Spacer, VBox} from './ui.js'
import {flatten} from './grid3layout.js'

export function SourceList({data, column, row, secondary, selected, renderItem, setSelected}) {
    if(!data) {
        data = []
        for (let i = 0; i < 20; i++) {
            data.push(`line ${i}`)
        }
    }
    if(!renderItem) {
        renderItem = (item) => item.toString()
    }
    let cls = `source-list col${column} row${row}`
    if(secondary) cls += ' secondary'
    return <ul className={cls}>{data.map((o,i)=> {
        let args = {
            item:o,
            key:i,
            isSelected:selected&&selected.id===o.id,
            onClick:(e)=>setSelected(o)
        }
        return renderItem(args)
        })}</ul>
}
export function StandardSourceItem({title, subtitle, icon, header=false, onDoubleClick, isSelected, onClick}) {
    let cls = {
        selected:isSelected,
        header:header,
    }
    return <li onDoubleClick={onDoubleClick}
               className={flatten(cls)}
               onClick={onClick}
    >
        {(!header&&icon)?<Icon>{icon}</Icon>:""}
        <VBox>
            {title?<span className={'title'}>{title}</span>:""}
            {subtitle?<span className={'subtitle'}>{subtitle}</span>:""}
        </VBox>
    </li>

}