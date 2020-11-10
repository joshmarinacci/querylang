const {Readability} = require('@mozilla/readability')
const fetch = require('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const cors = require('cors')
const express = require('express')

let app = express()
app.use(cors())
let PORT = 30011


app.set("json spaces", "  ")
app.get("/",(req,res)=>{
    calculateInfo(req.query.url)
        .then(summary => res.json({success:true, summary, url: req.query.url}))
        .catch(e => res.json({success:false}))
})
app.listen(PORT,()=>{
    console.log(`listening on port ${PORT}`)
})

function calculateInfo(url) {
    return fetch(url)
        .then(res => res.text())
        .then(body => {
            const doc = new JSDOM(body, {url: url });
            try {
                let reader = new Readability(doc.window.document);
                return reader.parse()
            } catch (e) {
                console.log("got an error",e)
            }
        })
        .then(summary => {
            // console.log("title is", summary.title)
            // console.log("excerpt is", summary.excerpt)
            // console.log("length is", summary.length)
            // console.log("content is", summary.textContent.substring(0, 255))
            return summary
        })
}
