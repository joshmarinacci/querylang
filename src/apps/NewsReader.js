import React, {useContext, useState} from 'react'
import {DBContext, propAsBoolean, propAsString, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {AND, IS_CATEGORY, IS_TYPE} from '../query2.js'
import "./DataBrowser.css"
import {Grid3Layout} from '../ui/grid3layout.js'
import {SourceList, StandardSourceItem} from '../ui/sourcelist.js'

import {format} from "date-fns"


export function NewsReader({}) {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.RSS.ID)
    let [post, set_post] = useState(null)

    let posts = db.QUERY(AND(IS_CATEGORY(CATEGORIES.RSS.ID), IS_TYPE(CATEGORIES.RSS.SCHEMAS.POST.TYPE)))
    return <Grid3Layout>
        <div className={'col1 row1'}>news</div>
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
        <div className={'summary'}>{propAsString(post,'summary')}</div>
    </div>
}