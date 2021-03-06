import React, {useState} from 'react'
import {DBContext, makeDB} from '../db.js'
import "../ui/themetester.css"
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import {CATEGORIES} from '../schema.js'
import {NewsReader} from '../apps/NewsReader.js'
import {DialogContainer, DialogManager, DialogManagerContext} from '../ui/DialogManager.js'

export default {
    title: 'QueryOS/Apps',
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

    let sub2 = db.make(CATEGORIES.RSS.ID, CATEGORIES.RSS.SCHEMAS.SUBSCRIPTION.TYPE)
    db.setProp(sub2,'title','ARS')
    db.setProp(sub2,'url',"http://feeds.arstechnica.com/arstechnica/index/")
    db.setProp(sub2, 'tags',['nasa','space'])
    db.add(sub2)

}


let db = makeDB()
let pm = new PopupManager()
let dm = new DialogManager()

export const NewsReaderSimple = () => {
    useState(()=>{
        console.log("generating data")
        generate_data(db)
    })


    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <DialogManagerContext.Provider value={dm}>
                <NewsReader/>
                <PopupContainer/>
                <DialogContainer/>
            </DialogManagerContext.Provider>
        </PopupManagerContext.Provider>
    </DBContext.Provider>

}