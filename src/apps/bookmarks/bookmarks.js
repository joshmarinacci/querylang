import "./bookmarks.css"

import React, {useContext, useState} from 'react'
import {
    DataList,
    EnumPropEditor,
    HBox,
    Panel,
    Spacer,
    TagsetEditor,
    TextPropEditor,
    Toolbar,
    VBox,
    Window
} from '../../ui/ui.js'
import {DBContext, propAsBoolean, useDBChanged} from '../../db.js'
import {AND, IS_CATEGORY, IS_TYPE} from '../../query2.js'
import {CATEGORIES} from '../../schema.js'
import {Icon} from '@material-ui/core'

import {format} from 'date-fns'
import {propAsArray, propAsString} from '../../db.js'

export function BookmarksManager({app}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.BOOKMARKS.ID)


    const [add_visible, set_add_visible] = useState(false)
    const [draft, setDraft] = useState({})

    const show_add_dialog = () => {
        let obj =db.make(CATEGORIES.BOOKMARKS.ID, CATEGORIES.BOOKMARKS.SCHEMAS.BOOKMARK.TYPE)
        setDraft(obj)
        set_add_visible(true)
    }

    const add_bookmark = (bk) => {
        set_add_visible(false)
        if(bk) db.add(bk)
        console.log(bk)
    }

    let bookmarks = db.QUERY(AND(IS_CATEGORY(CATEGORIES.BOOKMARKS.ID),IS_TYPE(CATEGORIES.BOOKMARKS.SCHEMAS.BOOKMARK.TYPE)))
    return <Window app={app}>
        <VBox grow className={'content-panel'}>
            <Toolbar>
                <Icon onClick={show_add_dialog}>add</Icon>
            </Toolbar>
            <DataList data={bookmarks} stringify={(o)=> <BookmarkView key={o.id} bookmark={o} db={db}/>}/>
        </VBox>
        <AddDialog visible={add_visible} onAdd={add_bookmark} draft={draft} db={db}/>
    </Window>
}

function AddDialog({visible, onAdd, draft, db}) {
    if(!visible) return <div style={{display:'none'}}/>
    return <div className={'dialog add'} style={{
        display:visible?"flex":'none'
    }}>
        <VBox grow>
            <Panel>
                <TextPropEditor buffer={draft} prop={'title'}/>
                <TextPropEditor buffer={draft} prop={'url'}/>
                <TagsetEditor buffer={draft} prop={'tags'}/>
            </Panel>
        </VBox>
        <Toolbar className={'bottom'}>
            <Spacer/>
            <button onClick={()=>onAdd(null)}>cancel</button>
            <button onClick={()=>onAdd(draft)}>save</button>
        </Toolbar>
    </div>
}


function BookmarkView({bookmark, db}) {
    const open_tab = () => {
        window.open(propAsString(bookmark,'url'),"_blank")
    }
    return <HBox grow className={"bookmark"}>
        <b onClick={open_tab}>{propAsString(bookmark,'title')}</b>
        <i>{propAsArray(bookmark,'tags').join(", ")}</i>
    </HBox>
}