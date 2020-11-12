import React from 'react'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_TYPE} from '../query2.js'
import {CATEGORIES} from '../schema.js'

export class AppLauncherService {
    constructor() {
        this.running = []
        this.listeners = []
    }
    launch(app) {
        this.running.push(app)
        // remove dupes
        let group = new Map()
        this.running.forEach(a => group.set(a.id, a))
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
        this.launch(apps[0])
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
