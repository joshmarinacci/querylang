import {VBox} from '../ui/ui.js'
import {CATEGORIES} from '../schema.js'
import {useContext} from 'react'
import {DBContext} from '../db.js'
import {upload_url} from '../services/files.js'

export function WebpageScanResultsPanel({args, onClose}) {
    console.log("results are",args)
    let db = useContext(DBContext)

    const add_as_file = () => {
        console.log("ingesting",args.info.action.url, args.info)
        return upload_url(args.info.action.url).then(d => {
            console.log("got the result",d)
            onClose()
        })
    }
    const add_as_song = () => {
        console.log("ingesting",args.info.action.url)
    }
    const no_drag = (e) => e.preventDefault()

    if(args.info.results.image) {
        return <VBox>
            <img src={args.info.action.url} draggable={false} style={{userSelect:'none', userDrag:'none'}} onDragStart={no_drag}/>
            <button onClick={add_as_file}>add</button>
            <button onClick={onClose}>close</button>
        </VBox>
    }
    if(args.info.results.audio) {
        return <VBox>
            <audio src={args.info.action.url} controls={true}/>
            <button onClick={add_as_song}>add as song</button>
            <button onClick={add_as_file}>add as audio file</button>
            <button onClick={onClose}>close</button>
        </VBox>
    }
    if(args.info.results.pdf) {
        return <VBox>
            <div>it's a pdf</div>
            <div>author: {args.info.results.pdf.author}</div>
            <div>title: {args.info.results.pdf.title}</div>
            <div>{args.info.results.pdf.pageCount} pages</div>
            <div>{(args.info.results.size/1000/1000).toFixed(2)} MB</div>
            <button onClick={add_as_file}>add as file</button>
            <button onClick={onClose}>close</button>
        </VBox>
    }

    let r = args.info.results.html
    let feed = ""
    const add_as_news = () => {
        console.log('adding the feed',r.feed)
        let sub = db.make(CATEGORIES.RSS.ID, CATEGORIES.RSS.SCHEMAS.SUBSCRIPTION.TYPE)
        db.setProp(sub,'url',r.feed)
        db.setProp(sub,'title',r.title)
        db.setProp(sub,'description',r.description)
        db.add(sub)
        onClose()
    }
    if(r && r.feed) {
        feed = <button onClick={add_as_news}>add as News source</button>
    }
    let image = ""
    if(r && r.image) {
        image = <img src={r.image} draggable={false} onDragStart={no_drag}/>
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