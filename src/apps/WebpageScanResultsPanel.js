import {HBox, VBox} from '../ui/ui.js'
import {CATEGORIES} from '../schema.js'
import {useContext} from 'react'
import {DBContext} from '../db.js'

export function WebpageScanResultsPanel({args, onClose}) {
    // console.log("results are",args)
    let r = args.info.results
    console.log(r)
    let feed = ""

    let db = useContext(DBContext)

    const add_as_news = () => {
        console.log('adding the feed',r.feed)
        let sub = db.make(CATEGORIES.RSS.ID, CATEGORIES.RSS.SCHEMAS.SUBSCRIPTION.TYPE)
        db.setProp(sub,'url',r.feed)
        db.setProp(sub,'title',r.title)
        db.setProp(sub,'description',r.description)
        db.add(sub)
        onClose()
    }
    if(r.feed) {
        feed = <button onClick={add_as_news}>add as News source</button>
    }
    let image = ""
    if(r.image) {
        image = <img src={r.image}/>
    }
    return <VBox style={{
        alignItems:'center',
    }} className={'WebpageScanResultsPanel'}>

            <b>{r.url}</b>
        <h3>{r.title}</h3>
        <p>{r.description}</p>
        {image}
        {feed}
        <button onClick={onClose}>close</button>
    </VBox>

}