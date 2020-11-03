import {render} from '@testing-library/react'
import App from './App.js'
import React from 'react'

import {CATEGORIES} from "./schema.js"
import {query2} from './query2.js'
import {DATA} from "./data.js"
import {sort} from './db.js'
import {compareAsc} from "date-fns"



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


test('sort by date',()=>{
    const and = (...args) => ({ and: args})
    const isEmail = () => ({ TYPE:CATEGORIES.EMAIL.TYPES.MESSAGE  })
    const isMessage = () => ({ CATEGORY:CATEGORIES.EMAIL.ID})

    let res1 = query2(DATA,and(isMessage(),isEmail()))
    res1 = sort(res1,["timestamp"])
    let res2 = res1.slice()
    res2.sort((a,b)=> compareAsc(a.props.timestamp, b.props.timestamp))
    console.log("res2", res2.map(o => o.props.timestamp))
    expect(res1.length).toBe(4)
    expect(res1).toEqual(res2)
})

function encode_props_with_types(value) {
    let props = {}
    Object.keys(value).forEach(k => {
        let prefix = ''
        let val = value[k]
        if(value[k] instanceof Date) {
            prefix = '_date_'
            val = val.toISOString()
        }
        props[prefix+k] = val
    })
    return props
}

function decode_props_with_types(value) {
    let props = {}
    Object.keys(value).forEach(k => {
        if(k.startsWith('_date_')) {
            let k2 = k.replace('_date_','')
            props[k2] = new Date(value[k])
        } else {
            props[k] = value[k]
        }
    })
    return props
}

test('date encoding test',() => {
    let obj1 = {
        props: {
            time: new Date()
        }
    }

    console.log("obj1",obj1)
    expect(typeof obj1.props.time).toBe('object')

    let str = JSON.stringify(obj1,function(key,value){
        if(key === 'props') return encode_props_with_types(value)
        return value
    })
    console.log('JSON string is',str)
    let obj2 = JSON.parse(str,function(key,value) {
        if(key === 'props') return decode_props_with_types(value);
        return value
    })
    console.log('obj2',obj2)
    expect(obj2.props.time instanceof Date).toBe(true)
    expect(obj2.props.time.toISOString()).toBe(obj1.props.time.toISOString())
})