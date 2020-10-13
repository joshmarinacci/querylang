import {render} from '@testing-library/react'
import App from './App.js'
import React from 'react'

import {CATEGORIES, DATA} from "./schema.js"


function isAnd(opts) {
    if(opts.hasOwnProperty('and')) return true
    return false
}

function isOr(opts) {
    if(opts.hasOwnProperty('or')) return true
    return false
}

function processAnd(opts, o) {
    let ands = opts.and
    let pass = true
    ands.forEach((pred)=>{
        console.log("checking predicate",pred,o)
        if(pred.hasOwnProperty('TYPE')) {
            if(o.type !== pred.TYPE) {
                pass = false
                console.log("failed")
            }
        }
        if(pred.hasOwnProperty('CATEGORY')) {
            if(o.category !== pred.CATEGORY) {
                pass = false
                console.log("failed")
            }
        }
        if(pred.hasOwnProperty('equal')) {
            if(pred.equal.prop === 'type') {
                console.log("checking",o.type,pred.equal.value)
                if(o.type !== pred.equal.value) {
                    pass = false
                    console.log("failed")
                }
            }
            if(pred.equal.prop === 'category') {
                if(o.category !== pred.equal.value) {
                    pass = false
                    console.log("failed")
                }
            }
        }
        if(isOr(pred)) {
            let res = processOr(pred,o)
            console.log("OR result is",res,o)
            if(!res) {
                pass = false
                console.log("failed")
            }
            console.log("final is",pass)
        }
    })
    return pass
}

function processOr(opts, o) {
    let pass = false
    let ors = opts.or
    ors.forEach(pred => {
        if(pred.hasOwnProperty('substring')) {
            let prop = pred.substring.prop
            if(o.props && o.props.hasOwnProperty(prop) && o.props[prop].toLowerCase().includes(pred.substring.value.toLowerCase())) {
                pass = true
            }
        }
    })
    return pass
}

function query2(data,opts) {
    let res = []
    data.forEach(o => {
        if(isAnd(opts) && processAnd(opts,o)) res.push(o)
        if(isOr(opts) && processOr(opts,o)) res.push(o)
    })
    return res
}

test('find all chat messages', () => {

    //find all chat messages
    let res = query2(DATA,{
        and:[
            {
                TYPE: CATEGORIES.CHAT.TYPES.MESSAGE

            },
            {
                CATEGORY:CATEGORIES.CHAT.ID
            }
        ]
    })
    expect(res.length).toBe(4)
});

test('find all items where first or last contains the substring "mar"', ()=>{
    let res = query2(DATA,{
        or:[
            {
                substring: {
                    prop: 'first',
                    value: 'arin'
                },
            },
            {
                substring:{
                    prop:'last',
                    value:'arin'
                }
            }
        ]
    })
    expect(res.length).toBe(2)
})

//compound AND and OR query
test('find all contacts.people where first or last contains the substring "Mar"',()=>{
    let res = query2(DATA,{
        and:[
            {
                TYPE: CATEGORIES.CONTACT.TYPES.PERSON,

            },
            {
                CATEGORY:CATEGORIES.CONTACT.ID
            },
            {
                or:[
                    {
                        substring: {
                            prop: 'first',
                            value: 'Mar'
                        },
                    },
                    {
                        substring:{
                            prop:'last',
                            value:'Mar'
                        }
                    }
                ]
            }
        ]
    })
    expect(res.length).toBe(2)
})