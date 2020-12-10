import "./bookmarks.css"

import React, {useContext, useState} from 'react'
import {
    HBox,
    Panel, PopupTriggerButton,
    Spacer, TagsetEditor, TextareaPropEditor,
    TextPropEditor,
    Toolbar, TopToolbar,
    VBox
} from '../../ui/ui.js'
import {formatDistanceToNow} from "date-fns"
import {DBContext, filterPropArrayContains, hasProp, propAsBoolean, sort, useDBChanged} from '../../db.js'
import {AND, IS_CATEGORY, IS_PROP_SUBSTRING, IS_TYPE, OR, query2 as QUERY} from '../../query2.js'
import {CATEGORIES, SORTS} from '../../schema.js'
import {Icon} from '@material-ui/core'

import {propAsArray, propAsString} from '../../db.js'
import {PopupManagerContext} from '../../ui/PopupManager.js'
import {calculateFoldersFromTags} from '../../util.js'
import {Grid3Layout} from '../../ui/grid3layout.js'
import {DataList, StandardSourceItem} from '../../ui/dataList.js'
import {TitleBar} from '../../stories/email_example.js'
import {StandardViewPanel} from '../../ui/StandardViewPanel.js'

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


export function BookmarksManager({app}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.BOOKMARKS.ID)

    const [add_visible, set_add_visible] = useState(false)
    const [draft, setDraft] = useState({})
    const [selected, setSelected] = useState(null)
    const [selectedQuery, setSelectedQuery] = useState(null)
    const [sortField, setSortField] = useState("title")
    const [sortOrder, setSortOrder] = useState(SORTS.ASCENDING)
    const [searchTerms, setSearchTerms] = useState("")


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
    if(searchTerms.length >= 2) bookmarks = QUERY(bookmarks, AND(IS_PROP_SUBSTRING('title',searchTerms)))

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


    return  <Grid3Layout>
        <TitleBar title={"Bookmarks"}/>

        <DataList column={1} row={2} data={queries} selected={selectedQuery} setSelected={setSelectedQuery}
                  renderItem={({item,...args})=> <StandardSourceItem
                                                       icon={propAsString(item,'icon')}
                                                       title={propAsString(item,'title')}
                                                       {...args}
                    />}/>
        <TopToolbar column={2}>
            <input type={'search'} value={searchTerms} onChange={e => setSearchTerms(e.target.value)}/>
            <Spacer/>
            <PopupTriggerButton onClick={showSortPopup} makePopup={showSortPopup} title={"Sort"}/>
        </TopToolbar>

        <DataList column={2} row={2} data={bookmarks} selected={selected} setSelected={setSelected}
                  renderItem={({item, ...args})=> {
                      let la = "never"
                      if(hasProp(item,'lastAccessed'))
                          la = formatDistanceToNow(item.props.lastAccessed) + " ago"
                      return <StandardSourceItem
                          icon={'bookmark'}
                          title={propAsString(item,'title')}
                          subtitle={propAsArray(item,'tags').join(", ") + " " +la}
                          onDoubleClick={()=>open_tab(item)}
                          {...args}/>
                  }}/>


        <TopToolbar column={3}>
            <Icon onClick={show_add_dialog}>add</Icon>
            <Icon>edit</Icon>
            <Spacer/>
            <Icon>delete</Icon>
        </TopToolbar>

        <BookmarkDetailsView bookmark={selected} onOpen={open_tab} className={"col3 row2"}/>

        <AddDialog visible={add_visible} onAdd={add_bookmark} draft={draft} db={db}/>
    </Grid3Layout>
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


function BookmarkDetailsView({bookmark, onOpen, ...rest}) {
    if(!bookmark) return <Panel {...rest}/>

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
    return <Panel {...rest}>
        <Toolbar>
            <button onClick={()=>onOpen(bookmark)}>open</button>
            <button onClick={open_translated}>translated</button>
            <button onClick={open_archived}>archived</button>
        </Toolbar>
        {/*<HBox>*/}
        {/*    <i>tags</i><b>{propAsArray(bookmark,'tags').join(", ")}</b>*/}
        {/*</HBox>*/}
        <StandardViewPanel object={bookmark}/>
    </Panel>
}