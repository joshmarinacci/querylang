import React from 'react'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import {genid} from '../data.js'

class AppInstance {
    constructor(app, args) {
        // console.log("making an app instance for",app)
        this.id = genid('appinstance')
        this.app = app
        this.args = args
        // console.log("args",args)
    }
}

export class AppLauncherService {
    constructor() {
        this.running = []
        this.listeners = []
    }
    launch(app, args) {
        this.running.push(new AppInstance(app, args))
        // remove dupes
        let group = new Map()
        this.running.forEach(ai => group.set(ai.id, ai))
        this.running = Array.from(group.values())
        // notify everyone
        this.listeners.forEach(l => l())
    }
    launchById(appid, db) {
        let apps = db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.APP.ID),
            IS_TYPE(CATEGORIES.APP.TYPES.APP),
            IS_PROP_EQUAL('appid', appid)
        ))
        if(!apps[0]) {
            console.error("can't launch app with appid", appid)
            console.error("app not found")
            return;
        }
        this.launch(apps[0])
    }
    launchByIdWithArgs(db, appid, args) {
        let apps = db.QUERY(AND(
            IS_CATEGORY(CATEGORIES.APP.ID),
            IS_TYPE(CATEGORIES.APP.TYPES.APP),
            IS_PROP_EQUAL('appid', appid)
        ))
        let app = apps[0]
        this.launch(app, args)
    }
    addEventListener(handler) {
        this.listeners.push(handler)
    }
    removeEventListener(handler) {
        this.listeners = this.listeners.filter(l => l !== handler)
    }
    close(app) {
        this.running = this.running.filter(a => a.id !== app.id)
        this.listeners.forEach(l => l())
    }
}

export const AppLauncherContext = React.createContext('app-launcher')
