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
    const [selected, setSelected] = useState(null)

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
    const open_tab = (bookmark) => {
        window.open(propAsString(bookmark,'url'),"_blank")
    }

    let bookmarks = db.QUERY(AND(IS_CATEGORY(CATEGORIES.BOOKMARKS.ID),IS_TYPE(CATEGORIES.BOOKMARKS.SCHEMAS.BOOKMARK.TYPE)))
    return <Window app={app}>
        <HBox grow>
            <VBox className={'sidebar'}>
                some sidebar
            </VBox>
            <VBox>
                <Toolbar>
                    <Icon onClick={show_add_dialog}>add</Icon>
                </Toolbar>
                <DataList data={bookmarks}
                selected={selected}
                setSelected={setSelected}
                          stringify={(o)=> <BookmarkView key={o.id} bookmark={o} db={db} onOpen={open_tab}/>}/>
            </VBox>
            <BookmarkDetailsView bookmark={selected} onOpen={open_tab}/>
        </HBox>
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


function BookmarkView({bookmark, db, onOpen}) {
    return <HBox grow className={"bookmark"}>
        <b onDoubleClick={()=>onOpen(bookmark)}>{propAsString(bookmark,'title')}</b>
        <i>{propAsArray(bookmark,'tags').join(", ")}</i>
    </HBox>
}

function BookmarkDetailsView({bookmark, onOpen}) {
    if(!bookmark) return <Panel></Panel>

    const open_translated = () => {
        let src = propAsString(bookmark,'url')
        let url = `https://translate.google.com/translate?hl=en&sl=auto&tl=en&u=${src}`
        window.open(url,"_blank")
    }
    return <Panel>
        <HBox><button onClick={()=>onOpen(bookmark)}>open</button></HBox>
        <HBox><button onClick={open_translated}>translated</button> </HBox>
        <HBox>
            <i>title</i><b>{propAsString(bookmark,'title')}</b>
        </HBox>
        <HBox>
            <i>url</i><b>{propAsString(bookmark,'url')}</b>
        </HBox>
        <HBox>
            <i>tags</i><b>{propAsArray(bookmark,'tags').join(", ")}</b>
        </HBox>
    </Panel>
}