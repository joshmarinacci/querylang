import React, {useContext, useState} from 'react'
import {DBContext, propAsBoolean, propAsString, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../query2.js'
import "./DataBrowser.css"
import {Grid3Layout} from '../ui/grid3layout.js'
import {DataList, StandardSourceItem} from '../ui/dataList.js'

import {format} from "date-fns"
import {Panel, Toolbar} from '../ui/ui.js'
import {flatten} from '../util.js'
import "./NewsReader.css"
import {DialogManagerContext} from '../ui/DialogManager.js'
import {RSS_SERVER_URL} from '../globals.js'



function refresh (db) {
    let subs = db.QUERY(AND(IS_CATEGORY(CATEGORIES.RSS.ID), IS_TYPE(CATEGORIES.RSS.SCHEMAS.SUBSCRIPTION.TYPE)))
    subs.map(sub => {
        let url = `${RSS_SERVER_URL}?url=${propAsString(sub,'url')}`;
        return fetch(url).then(r => r.json()).then(d => {
            //update subscription title and description if changed
            db.setProp(sub,'title',d.meta.title)
            db.setProp(sub,'description',d.meta.description)
            console.log("scanning",url, d.posts.length)
            console.log(d)
            if(!d.meta.is_podcast) {
                console.log("not a podcast. skipping")
                return
            }

            //skip dupes if same GUID else add
            let posts = d.posts.map(p => {
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
                    return null
                } else {
                    // console.log("post is",p)
                    let post = db.make(CATEGORIES.RSS.ID, CATEGORIES.RSS.SCHEMAS.POST.TYPE)
                    db.setProp(post,'title',p.title)
                    db.setProp(post,'subscription',sub.id)
                    db.setProp(post,'guid',p.guid)
                    db.setProp(post,'url',p.permalink)
                    db.setProp(post,'post_date',new Date(p.date))
                    db.setProp(post,'summary',p.description)
                    db.setProp(post,'image',p.image)
                    if(p.enclosures && p.enclosures.length > 0) {
                        console.log("got enclsoure",p.enclosures[0])
                        let enc = p.enclosures[0]
                        if(enc.type === 'audio/mpeg' && enc.url) {
                            db.setProp(post,'media',enc)
                        }
                    }
                    // db.add(post)
                    console.log("added post",post.props.title)
                    return post
                }
            })
            posts = posts.filter(p => p !== null)
            console.log("final posts are",posts.length)
            db.bulk_add(posts,CATEGORIES.RSS.ID)
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

export function PodcastPlayer({}) {
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
    return <Grid3Layout>
        <div className={'col1 row1'}>news</div>
        <Toolbar>
            <button onClick={()=>refresh(db)}>refresh</button>
            <button onClick={()=>add_feed()}>add feed</button>
        </Toolbar>
        <DataList column={1} row={2} data={subs} selected={sub} setSelected={set_sub}
                  renderItem={({item,...rest})=>{
                        return <StandardSourceItem title={propAsString(item,'title')}
                                                   {...rest}
                        />
                    }}/>
        <DataList column={2} row={2} data={posts} selected={post} setSelected={set_post}
                  renderItem={({item,...rest})=>{
                        return <StandardSourceItem className={(propAsBoolean(item,'read')?"read":"unread")} title={propAsString(item,'title')} {...rest}/>
                    }}/>
        <Toolbar>
            <button onClick={mark_as_read}>mark as read</button>
        </Toolbar>
        <EpisodePanel className={'col3 row2'} post={post}/>
    </Grid3Layout>
}

function EpisodePanel({post, className}) {
    if(!post) return <div className={'episode' + className}>nothing selected</div>

    let cls = {
        podcast:true,
        panel:true,
        played:propAsBoolean(post,'read')
    }
    console.log("episode is",post)
    let media = <div>cannot play</div>
    if(post.props.media && post.props.media.url) {
        media = <audio src={post.props.media.url} controls={true}/>
    }
    return <div className={flatten(cls)+" "+className}>
        <h3 className={'title'}>{propAsString(post,'title')}</h3>
        <h4>{format(post.props.post_date,'MMM d yyyy')}</h4>
        <img src={propAsString(post,'image')}/>
        {media}
    </div>
}