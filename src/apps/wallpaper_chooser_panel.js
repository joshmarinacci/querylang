import React, {useContext} from 'react'
import {DBContext, useDBChanged} from '../db.js'

export function WallpaperChooser() {
    let db = useContext(DBContext)
    return <div>choose a wallpaper</div>
}