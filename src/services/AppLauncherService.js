import React from 'react'

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
