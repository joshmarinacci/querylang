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

function processEqual(equal, o) {
    if(!o) return false
    if(!o.props) return false
    if(!o.props.hasOwnProperty(equal.prop)) return false
    if(o.props[equal.prop] !== equal.value) return false
    return true
}

function processSubstring(substring, o) {
    if(!o) return false
    if(!o.props) return false
    if(!o.props.hasOwnProperty(substring.prop)) return false
    if(!o.props[substring.prop].toLowerCase().includes(substring.value.toLowerCase())) return false
    return true
}

function passPredicate(pred,o) {
    if(pred.hasOwnProperty('TYPE') && o.type !== pred.TYPE) return false
    if(pred.hasOwnProperty('CATEGORY') && o.category !== pred.CATEGORY) return false
    if(isOr(pred) && !processOr(pred,o)) return false;
    if(isAnd(pred) && !processAnd(pred,o)) return false;
    if(pred.hasOwnProperty('equal') && !processEqual(pred.equal,o)) return false
    if(pred.hasOwnProperty('substring') && !processSubstring(pred.substring,o)) return false
    return true
}

function processAnd(opts, o) {
    let pass = true
    opts.and.forEach(pred =>{
        if(!pass) return //skip ones that have already failed
        if(!passPredicate(pred,o)) pass = false
    })
    return pass
}

function processOr(opts, o) {
    let pass = false
    opts.or.forEach(pred => {
        if(pass) return //skip if one already succeeded
        if(passPredicate(pred,o)) pass = true
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

test('query building',()=>{

    const and = (...args) => ({ and: args})
    const or = (...args) => ({ or: args})
    const isPerson = () => ({ TYPE:CATEGORIES.CONTACT.TYPES.PERSON  })
    const isContact = () => ({ CATEGORY:CATEGORIES.CONTACT.ID })
    const hasSubstring = (f,value) => ({substring:{prop:f,value:value }})

    const res = query2(DATA,and(isPerson(),isContact(),or(
        hasSubstring('last','mar'),
        hasSubstring('first','mar')
    )))

    expect(res.length).toBe(2)
})


//find all notes where archived is true
test('archived notes',()=>{
    const and = (...args) => ({ and: args})
    const isNote = () => ({ TYPE:CATEGORIES.NOTES.TYPES.NOTE  })
    const isArchived = () => ({ equal:{prop:'archived',value:true}})

    const res = query2(DATA,and(isNote(),isArchived()))
    expect(res.length).toBe(2)
})

