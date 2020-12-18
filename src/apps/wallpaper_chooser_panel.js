import React, {useContext, useState} from 'react'
import {DBContext, propAsString, useDBChanged} from '../db.js'
import {HBox, VBox} from '../ui/ui.js'
import {DataList, StandardSourceItem} from '../ui/dataList.js'
import {AND, IS_CATEGORY, IS_PROP_CONTAINS, IS_TYPE} from '../query2.js'
import {CATEGORIES} from '../schema.js'
import {FilePreview} from '../ui/filepreview.js'

let set_wallpaper = (file) => {
    let elem = document.querySelector("html")
    elem.style.backgroundColor = 'white'
    elem.style.backgroundImage = `url(${file.props.url})`
    elem.style.backgroundSize = "contain"
    elem.style.backgroundRepeat = "no-repeat"
    elem.style.backgroundPosition = 'center'
}

export function WallpaperChooser() {
    let db = useContext(DBContext)
    useDBChanged(db,CATEGORIES.FILES.ID)

    let items = db.QUERY(AND(
        IS_TYPE(CATEGORIES.FILES.SCHEMAS.FILE_INFO.TYPE),
        IS_CATEGORY(CATEGORIES.FILES.ID),
        IS_PROP_CONTAINS(CATEGORIES.FILES.SCHEMAS.FILE_INFO.props.tags.key,"wallpaper")
    ))
    const [sel, set_sel] = useState()

    // click 'set wallpaper' button to make it live
    return <HBox grow scroll>
        <DataList data={items}
                  selected={sel}
                  setSelected={set_sel}
                  renderItem={({item,...rest})=>{
                      return <StandardSourceItem title={propAsString(item,'filename')} {...rest}/>
                  }}
                  />
        <VBox>
            <FilePreview file={sel}/>
            <button onClick={()=>set_wallpaper(sel)}>set as wallpaper</button>
        </VBox>
    </HBox>
}