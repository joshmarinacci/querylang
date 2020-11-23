import React, {useEffect, useState} from 'react'
import {THEME_SCHEMA, ThemeTester} from "../ui/themetester.js"
import {DBContext, decode_props_with_types, makeDB, useDBChanged} from '../db.js'
import "../ui/themetester.css"
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import {CATEGORIES} from '../schema.js'
import {NewsReader} from '../apps/NewsReader.js'

export default {
    title: 'QueryOS/NewsReader',
    component: NewsReader,
    argTypes: {
    },
};


function generate_data(db) {
    let sub = db.make(CATEGORIES.RSS.ID, CATEGORIES.RSS.SCHEMAS.SUBSCRIPTION.TYPE)
    db.setProp(sub,'title','VR News')
    db.setProp(sub,'url',"https://www.nasa.gov/rss/dyn/breaking_news.rss")
    db.setProp(sub, 'tags',['nasa','space'])
    db.add(sub)

    let post = db.make(CATEGORIES.RSS.ID, CATEGORIES.RSS.SCHEMAS.POST.TYPE)
    db.setProp(post,'title','new updates from Oculus')
    db.setProp(post,'subscription',sub.id)
    db.setProp(post,'url','some longer url')
    db.setProp(post,'post_date',new Date(2020,10,9))
    db.setProp(post,'read',false)
    db.add(post)


    let post2 = db.make(CATEGORIES.RSS.ID, CATEGORIES.RSS.SCHEMAS.POST.TYPE)
    db.setProp(post2,'title','crazy cool new stuff')
    db.setProp(post2,'subscription',sub.id)
    db.setProp(post2,'url','some longer url too')
    db.setProp(post2,'post_date',new Date(2020,10,15))
    db.setProp(post2,'read',false)
    db.add(post2)
}


let db = makeDB()
let pm = new PopupManager()

export const NewsReaderSimple = () => {
    useState(()=>{
        console.log("generating data")
        generate_data(db)
    })


    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <NewsReader/>
            <PopupContainer/>
        </PopupManagerContext.Provider>
    </DBContext.Provider>

}