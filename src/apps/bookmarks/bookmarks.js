import "./bookmarks.css"

import React, {useContext, useRef, useState} from 'react'
import {
    DataList,
    HBox,
    Panel,
    Spacer, StandardListItem,
    TagsetEditor, TextareaPropEditor,
    TextPropEditor,
    Toolbar,
    VBox,
    Window
} from '../../ui/ui.js'
import {format, formatDistanceToNow} from "date-fns"
import {DBContext, filterPropArrayContains, hasProp, propAsBoolean, sort, useDBChanged} from '../../db.js'
import {AND, IS_CATEGORY, IS_TYPE} from '../../query2.js'
import {CATEGORIES, SORTS} from '../../schema.js'
import {Icon} from '@material-ui/core'

import {propAsArray, propAsString} from '../../db.js'
import {PopupManagerContext} from '../../ui/PopupManager.js'
import {calculateFoldersFromTags} from '../../util.js'

function PopupMenu ({children}) {
    let pm = useContext(PopupManagerContext)
    return <ul className={'popup-menu'}>{children}</ul>
}

function MenuItem({title, onClick, checked=false}) {
    let pm = useContext(PopupManagerContext)
    return <li className={'menu-item'} onClick={()=>{
        pm.hide()
        onClick()
    }}>
        <Icon>{checked?"checked":"null"}</Icon>
        {title}</li>
}
function MenuDivider({}) {
    return <li className={'menu-item menu-item-divider'}></li>
}

function PopupTriggerButton({makePopup, title}) {
    const popupButton = useRef()
    let pm = useContext(PopupManagerContext)

    const showSortPopup = () => pm.show(makePopup(),popupButton.current)
    return <button onClick={showSortPopup} ref={popupButton}
                   className={'popup-trigger-button'}
    >
        {title}
        <Icon>arrow_drop_down</Icon>
    </button>
}

export function BookmarksManager({app}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.BOOKMARKS.ID)

    const [add_visible, set_add_visible] = useState(false)
    const [draft, setDraft] = useState({})
    const [selected, setSelected] = useState(null)
    const [selectedQuery, setSelectedQuery] = useState(null)
    const [sortField, setSortField] = useState("title")
    const [sortOrder, setSortOrder] = useState(SORTS.ASCENDING)

    const show_add_dialog = () => {
        let obj = db.make(CATEGORIES.BOOKMARKS.ID, CATEGORIES.BOOKMARKS.SCHEMAS.BOOKMARK.TYPE)
        setDraft(obj)
        set_add_visible(true)
    }
    const add_bookmark = (bk) => {
        set_add_visible(false)
        if(bk) db.add(bk)
        console.log(bk)
    }
    const open_tab = (bookmark) => {
        db.setProp(bookmark,'lastAccessed',new Date())
        window.open(propAsString(bookmark,'url'),"_blank")
    }
    const showSortPopup = () => {
        let menu = <PopupMenu>
            <MenuItem title={"most recent"}
                      onClick={()=>setSortField("lastAccessed")}
                      checked={sortField==='lastAccessed'}
            />
            <MenuItem title={"title"}
                      onClick={()=>setSortField("title")}
                      checked={sortField==='title'}
            />
            <MenuDivider/>
            <MenuItem title={'Descending'}
                      onClick={()=>setSortOrder(SORTS.DESCENDING)}
                      checked={sortOrder===SORTS.DESCENDING}
            />
            <MenuItem title={'Ascending'}
                      onClick={()=>setSortOrder(SORTS.ASCENDING)}
                      checked={sortOrder === SORTS.ASCENDING}
            />
        </PopupMenu>
        return menu
    }

    let bookmarks = db.QUERY(AND(IS_CATEGORY(CATEGORIES.BOOKMARKS.ID),IS_TYPE(CATEGORIES.BOOKMARKS.SCHEMAS.BOOKMARK.TYPE)))

    let queries = calculateFoldersFromTags(bookmarks)
    queries.unshift({
        id:"ids000",
        props: {
            icon:'bookmarks',
            title:'all'
        }
    })


    if(propAsBoolean(selectedQuery,'tag')) {
        bookmarks = filterPropArrayContains(bookmarks,
            {tags:propAsString(selectedQuery,'title')})
    }

    bookmarks = sort(bookmarks, [sortField], sortOrder )


    return <Window app={app}>
        <VBox grow>
            <Toolbar>
                <Icon onClick={show_add_dialog}>add</Icon>
            </Toolbar>
        <HBox grow>
            <VBox className={'sidebar'}>
                <Toolbar><label>label</label></Toolbar>
                <DataList data={queries}
                          selected={selectedQuery}
                          setSelected={setSelectedQuery}
                          stringify={(o,i)=> <StandardListItem key={i}
                                                               icon={propAsString(o,'icon')}
                                                               title={propAsString(o,'title')}/>}/>
            </VBox>
            <VBox className={'sidebar'}>
                <Toolbar>
                    <Spacer/>
                    <PopupTriggerButton onClick={showSortPopup} makePopup={showSortPopup} title={"Sort"}/>
                </Toolbar>
                <DataList data={bookmarks}
                selected={selected}
                setSelected={setSelected}
                          stringify={(o)=> <BookmarkView key={o.id} bookmark={o} onOpen={open_tab}/>}/>
            </VBox>
            <BookmarkDetailsView bookmark={selected} onOpen={open_tab}/>
        </HBox>

        </VBox>
        <AddDialog visible={add_visible} onAdd={add_bookmark} draft={draft} db={db}/>
    </Window>
}

function AddDialog({visible, onAdd, draft, db}) {
    const [update, setUpdate] = useState(false)
    if(!visible) return <div style={{display:'none'}}/>
    const analyze = () => {
        let url = `http://localhost:30011/?url=${propAsString(draft,'url')}`
        fetch(url)
            .then(res => res.json())
            .then(res => {
                console.log('readability result is', res)
                if(res.success) {
                    db.setProp(draft,'title',res.summary.title)
                    db.setProp(draft, 'excerpt', res.summary.excerpt)
                }
                setUpdate(!update)
        })
    }
    return <div className={'dialog add'} style={{ display:visible?"flex":'none' }}>
        <VBox grow>
            <Panel>
                <HBox center>
                    <TextPropEditor buffer={draft} prop={'url'} grow/>
                    <button onClick={analyze}>analyze</button>
                </HBox>
                <TextPropEditor buffer={draft} prop={'title'}/>
                <TextareaPropEditor buffer={draft} prop={'excerpt'}/>
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


function BookmarkView({bookmark, onOpen}) {
    let la = "never"
    if(hasProp(bookmark,'lastAccessed'))
        la = formatDistanceToNow(bookmark.props.lastAccessed) + " ago"
    return <StandardListItem
        icon={'bookmark'}
        title={propAsString(bookmark,'title')}
        subtitle={propAsArray(bookmark,'tags').join(", ") + " " +la}
        onDoubleClick={()=>onOpen(bookmark)}
    />
}

function BookmarkDetailsView({bookmark, onOpen}) {
    if(!bookmark) return <Panel></Panel>

    const open_translated = () => {
        let src = propAsString(bookmark,'url')
        let url = `https://translate.google.com/translate?hl=en&sl=auto&tl=en&u=${src}`
        window.open(url,"_blank")
    }
    const open_archived = () => {
        let src = propAsString(bookmark,'url')
        let url = `https://web.archive.org/web/${src}`
        window.open(url,"_blank")
    }
    return <Panel>
        <HBox><button onClick={()=>onOpen(bookmark)}>open</button></HBox>
        <HBox><button onClick={open_translated}>translated</button> </HBox>
        <HBox><button onClick={open_archived}>archived</button> </HBox>
        <HBox>
            <i>url</i><b>{propAsString(bookmark,'url')}</b>
        </HBox>
        <HBox>
            <i>title</i><b>{propAsString(bookmark,'title')}</b>
        </HBox>
        <HBox>
            <i>tags</i><b>{propAsArray(bookmark,'tags').join(", ")}</b>
        </HBox>
        <HBox>
            <p><b>excerpt</b>
                {propAsString(bookmark,'excerpt')}
            </p>
        </HBox>
    </Panel>
}