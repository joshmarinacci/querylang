import React from 'react';
import Icon from '@material-ui/core/Icon'
import {HBox, Spacer, VBox} from './ui.js'
import {flatten} from './grid3layout.js'

export function SourceList({data, column=1, row=1, secondary, selected, renderItem, setSelected, className=""}) {
    if(!data) {
        data = []
        for (let i = 0; i < 20; i++) {
            data.push(`line ${i}`)
        }
    }
    if(!renderItem) {
        renderItem = (item) => item.toString()
    }
    let cls = `source-list col${column} row${row} ${className}`
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

export function StandardSourceItem({title, subtitle, icon, trailing_icon, trailing_text, header=false, onDoubleClick, isSelected, onClick, className=""}) {
    let cls = {
        selected:isSelected,
        header:header,
    }

    const row1 = <HBox center>
        {(!header&&icon)?<Icon>{icon}</Icon>:""}
        {title?<span className={'title'}>{title}</span>:""}
        <Spacer/>
        {trailing_text?<span className={'trailing_text'}>{trailing_text}</span>:""}
        {(!header&&trailing_icon)?<Icon>{trailing_icon}</Icon>:""}
    </HBox>

    let row2 = <HBox/>
    if(subtitle) {
        row2 = <HBox>
                <Icon>x</Icon>
                {subtitle?<span className={'secondary'}>{subtitle}</span>:""}
                <Icon>x</Icon>
            </HBox>
    }
    return <li onDoubleClick={onDoubleClick}
               className={flatten(cls) + " " + className}
               onClick={onClick}
    >
        <VBox grow>
            {row1}
            {row2}
        </VBox>
    </li>

}