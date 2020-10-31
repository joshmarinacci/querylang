import React from 'react'

export class AppLauncherService {
    constructor() {
        this.running = []
        this.listeners = []
    }
    launch(app) {
        this.running.push(app)
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
