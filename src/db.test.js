import {render} from '@testing-library/react'
import App from './App.js'
import React from 'react'

import {CATEGORIES, DATA} from "./schema.js"
import {query2} from './query2.js'



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

