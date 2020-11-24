import React, {useContext, useState} from 'react'
import {DBContext, propAsBoolean, propAsString, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../query2.js'
import "./DataBrowser.css"
import {Grid3Layout} from '../ui/grid3layout.js'
import {SourceList, StandardSourceItem} from '../ui/sourcelist.js'

import {format} from "date-fns"
import {Panel, Toolbar} from '../ui/ui.js'
import {flatten} from '../util.js'
import "./NewsReader.css"
import {DialogManagerContext} from '../ui/DialogManager.js'
import dompurify from 'dompurify';

dompurify.addHook('afterSanitizeAttributes', function (node) {
    // set all elements owning target to target=_blank
    if ('target' in node) {
        node.setAttribute('target', '_blank');
    }
    // set non-HTML/MathML links to xlink:show=new
    if (
        !node.hasAttribute('target') &&
        (node.hasAttribute('xlink:href') || node.hasAttribute('href'))
    ) {
        node.setAttribute('xlink:show', 'new');
    }
});


const RSS_SERVER_URL = "http://localhost:30011/rss"

function refresh (db) {
    console.log("parsing feed")
    let subs = db.QUERY(AND(IS_CATEGORY(CATEGORIES.RSS.ID), IS_TYPE(CATEGORIES.RSS.SCHEMAS.SUBSCRIPTION.TYPE)))
    subs.map(sub => {
        let url = `${RSS_SERVER_URL}?url=${propAsString(sub,'url')}`;
        return fetch(url).then(r => r.json()).then(d => {
            //update subscription title and description if changed
            db.setProp(sub,'title',d.meta.title)
            db.setProp(sub,'description',d.meta.description)

            //skip dupes if same GUID else add
            d.posts.forEach(p => {
                let perm = p.permalink
                // console.log("searching for permalink",perm)
                let existing_posts = db.QUERY(AND(
                    IS_CATEGORY(CATEGORIES.RSS.ID),
                    IS_TYPE(CATEGORIES.RSS.SCHEMAS.POST.TYPE),
                    IS_PROP_EQUAL('guid',p.guid)
                    ))
                // console.log("existing",existing_posts.length)
                if(existing_posts.length >= 1){
                    // console.log("skipping")
                } else {
                    let post = db.make(CATEGORIES.RSS.ID, CATEGORIES.RSS.SCHEMAS.POST.TYPE)
                    db.setProp(post,'title',p.title)
                    db.setProp(post,'subscription',sub.id)
                    db.setProp(post,'guid',p.guid)
                    db.setProp(post,'url',p.permalink)
                    db.setProp(post,'post_date',new Date(p.date))
                    db.setProp(post,'summary',p.description)
                    db.add(post)
                    // console.log("added post",post)
                }
            })
        })
    })
}

function SimpleDialog({title="unnamed dialog", children}) {
    return <div className={"dialog"}>
        <h1>{title}</h1>
        {children}
    </div>
}

function AddFeedDialog({onDone, onCancel}) {
    let [url,set_url] = useState("")
    return <SimpleDialog title={"Add RSS Feed"}>
        <Panel>
            <input type={"text"} placeholder={"url of rss feed here"} value={url} onChange={e => set_url(e.target.value)}/>
        </Panel>
        <Toolbar>
            <button onClick={onCancel}>cancel</button>
            <button onClick={()=>onDone(url)}>add</button>
        </Toolbar>
    </SimpleDialog>
}

export function NewsReader({}) {
    let db = useContext(DBContext)
    let dm = useContext(DialogManagerContext)
    useDBChanged(db,CATEGORIES.RSS.ID)
    let [post, set_post] = useState(null)
    let [sub, set_sub] = useState(null)

    let subs = db.QUERY(AND(IS_CATEGORY(CATEGORIES.RSS.ID), IS_TYPE(CATEGORIES.RSS.SCHEMAS.SUBSCRIPTION.TYPE)))
    let posts = db.QUERY(AND(IS_CATEGORY(CATEGORIES.RSS.ID), IS_TYPE(CATEGORIES.RSS.SCHEMAS.POST.TYPE), IS_PROP_EQUAL('subscription',sub?sub.id:null)))

    const mark_as_read = () => {
        if(post) {
            db.setProp(post,'read',true)
        }
    }
    const add_feed= () =>{
        dm.show(<AddFeedDialog onCancel={()=>dm.hide()} onDone={(url)=>{
            let sub = db.make(CATEGORIES.RSS.ID, CATEGORIES.RSS.SCHEMAS.SUBSCRIPTION.TYPE)
            db.setProp(sub,'url',url)
            db.add(sub)
            refresh(db)
            dm.hide()
        }}/> )
    }
    const navNext = () => {
        let n = posts.indexOf(post)
        n++
        if(n < posts.length)  set_post(posts[n])
    }
    const navPrev = () => {
        let n = posts.indexOf(post)
        n--
        if(n>=0) set_post(posts[n])
    }
    return <Grid3Layout>
        <div className={'col1 row1'}>news</div>
        <Toolbar>
            <button onClick={()=>refresh(db)}>refresh</button>
            <button onClick={()=>add_feed()}>add feed</button>
        </Toolbar>
        <SourceList column={1} row={2} data={subs} selected={sub} setSelected={set_sub}
                    renderItem={({item,...rest})=>{
                        return <StandardSourceItem title={propAsString(item,'title')}
                            {...rest}
                        />
                    }}/>
        <SourceList column={2} row={2} data={posts}  selected={post} setSelected={set_post}
                    renderItem={({item,...rest})=>{
            return <StandardSourceItem className={(propAsBoolean(item,'read')?"read":"unread")} title={propAsString(item,'title')} {...rest}/>
        }}/>
        <Toolbar>
            <button onClick={mark_as_read}>mark as read</button>
        </Toolbar>
        <PostPanel className={'col3 row2'} post={post} navNext={navNext} navPrev={navPrev} />
    </Grid3Layout>
}

function PostPanel({post, className, navNext, navPrev}) {
    if(!post) return <div className={'post' + className}>nothing selected</div>

    let cls = {
        post:true,
        panel:true,
        read:propAsBoolean(post,'read')
    }

    const sum = propAsString(post,'summary')
    const html = dompurify.sanitize(sum)

    const openArticle = () => {
        window.open(propAsString(post,'url'),'_blank')
    }
    const keydown = (e) => {
        if(e.key === 'j') {
            navNext()
        }
        if(e.key === 'k') {
            navPrev()
        }
        if(e.key === 'v') {
            openArticle()
        }
    }

    return <div className={flatten(cls)+" "+className} tabIndex={0} onKeyDown={keydown}>
        <h3>{propAsString(post,'title')}</h3>
        <h4>{format(post.props.post_date,'MMM d')}</h4>
        <b>read = {propAsBoolean(post,'read')?"true":"false"}</b>
        <button>original</button>
        <a target="_blank" href={propAsString(post,'url')}>{propAsString(post,'url')}</a>
        <div className={'summary'} dangerouslySetInnerHTML={{__html: html}}/>
    </div>
}