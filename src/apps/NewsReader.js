import React, {useContext, useState} from 'react'
import {DBContext, propAsBoolean, propAsString, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../query2.js'
import "./DataBrowser.css"
import {Grid3Layout} from '../ui/grid3layout.js'
import {SourceList, StandardSourceItem} from '../ui/sourcelist.js'

import {format} from "date-fns"
import {Toolbar} from '../ui/ui.js'

const RSS_SERVER_URL = "http://localhost:30011/rss"

function refresh (db, subs) {
    console.log("parsing feed")
    console.log("refreshing subscriptions",subs)
    subs.map(sub => {
        let url = `${RSS_SERVER_URL}?url=${propAsString(sub,'url')}`;
        return fetch(url).then(r => r.json()).then(d => {
            console.log("got the data",d)
            //update subscription title and description if changed
            //for each post, if not existing post with same GUID and subscription ID, then add new post
            //skip dupes if same GUID
            d.posts.forEach(p => {
                let perm = p.permalink
                console.log("searching for permalink",perm)
                let existing_posts = db.QUERY(AND(
                    IS_CATEGORY(CATEGORIES.RSS.ID),
                    IS_TYPE(CATEGORIES.RSS.SCHEMAS.POST.TYPE),
                    IS_PROP_EQUAL('guid',p.guid)
                    ))
                console.log("existing",existing_posts.length)
                if(existing_posts.length >= 1){
                    console.log("skipping")
                } else {
                    let post = db.make(CATEGORIES.RSS.ID, CATEGORIES.RSS.SCHEMAS.POST.TYPE)
                    db.setProp(post,'title',p.title)
                    db.setProp(post,'subscription',sub.id)
                    db.setProp(post,'guid',p.guid)
                    db.setProp(post,'url',p.permalink)
                    db.setProp(post,'post_date',new Date(p.date))
                    db.setProp(post,'summary',p.summary)
                    db.add(post)
                    console.log("added post",post)
                }
            })
        })
    })
}

export function NewsReader({}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.RSS.ID)
    let [post, set_post] = useState(null)

    let subs = db.QUERY(AND(IS_CATEGORY(CATEGORIES.RSS.ID), IS_TYPE(CATEGORIES.RSS.SCHEMAS.SUBSCRIPTION.TYPE)))
    let posts = db.QUERY(AND(IS_CATEGORY(CATEGORIES.RSS.ID), IS_TYPE(CATEGORIES.RSS.SCHEMAS.POST.TYPE)))
    return <Grid3Layout>
        <div className={'col1 row1'}>news</div>
        <Toolbar>
            <button onClick={()=>refresh(db,subs)}>refresh</button>
        </Toolbar>
        <SourceList column={1} row={2} data={posts}  selected={post} setSelected={set_post}
                    renderItem={({item,...rest})=>{
            return <StandardSourceItem title={propAsString(item,'title')} {...rest}/>
        }}/>
        <PostPanel className={'col2 row2'} post={post}/>
    </Grid3Layout>
}

function PostPanel({post, className}) {
    if(!post) return <div className={'post' + className}>nothing selected</div>

    return <div className={'post ' + className}>this is a post
        <h3>{propAsString(post,'title')}</h3>
        <h4>{format(post.props.post_date,'MMM d')}</h4>
        <b>read = {propAsBoolean(post,'read')}</b>
        <button>original</button>
        <a target="_blank" href={propAsString(post,'url')}>{propAsString(post,'url')}</a>
        <div className={'summary'}>{propAsString(post,'summary')}</div>
    </div>
}