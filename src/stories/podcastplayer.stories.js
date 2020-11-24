import React, {useEffect, useState} from 'react'
import {THEME_SCHEMA, ThemeTester} from "../ui/themetester.js"
import {DBContext, decode_props_with_types, makeDB, useDBChanged} from '../db.js'
import "../ui/themetester.css"
import {PopupContainer, PopupManager, PopupManagerContext} from '../ui/PopupManager.js'
import {CATEGORIES} from '../schema.js'
import {NewsReader} from '../apps/NewsReader.js'
import {DialogContainer, DialogManager, DialogManagerContext} from '../ui/DialogManager.js'
import {PodcastPlayer} from '../apps/PodcastPlayer.js'

export default {
    title: 'QueryOS/Apps',
    component: PodcastPlayer,
    argTypes: {
    },
};


function generate_data(db) {
    let sub = db.make(CATEGORIES.RSS.ID, CATEGORIES.RSS.SCHEMAS.SUBSCRIPTION.TYPE)
    db.setProp(sub,'title','Planet Money')
    db.setProp(sub,'url',"https://feeds.npr.org/510289/podcast.xml")
    db.setProp(sub, 'tags',['finance','npr'])
    db.add(sub)
}


let db = makeDB()
let pm = new PopupManager()
let dm = new DialogManager()

export const SimplePodcastPlayer = () => {
    useState(()=>{
        console.log("generating data")
        generate_data(db)
    })


    return <DBContext.Provider value={db}>
        <PopupManagerContext.Provider value={pm}>
            <DialogManagerContext.Provider value={dm}>
                <PodcastPlayer/>
                <PopupContainer/>
                <DialogContainer/>
            </DialogManagerContext.Provider>
        </PopupManagerContext.Provider>
    </DBContext.Provider>

}