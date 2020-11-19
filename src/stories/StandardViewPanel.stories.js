import React, {useState} from 'react'

// import "../theme.css"
import {StandardViewPanel} from '../ui/StandardViewPanel.js'
import {makeDB, setProp} from '../db.js'
import {CATEGORIES} from '../schema.js'

export default {
    title: 'QueryOS/StandardViewPanel',
    component: StandardViewPanel,
    argTypes: {
    },
};

let db = makeDB()

const make_task =() => {
    let task = db.make(CATEGORIES.TASKS.ID, CATEGORIES.TASKS.TYPES.TASK)
    setProp(task,'title',"a cool task")
    setProp(task,'completed',true)
    setProp(task,'notes',"this is some very long notes to read. Like super duper long. So you're goint o have to spend some time reading this.")
    return task
}

function make_contact() {
    let person = db.make(CATEGORIES.CONTACT.ID, CATEGORIES.CONTACT.TYPES.PERSON)
    setProp(person,'first','Josh')
    setProp(person,'last','Marinacci')
    setProp(person, 'favorite',true)
    setProp(person, 'timezone', 'Europe/Berlin')
    setProp(person,'emails',[
        {
            type:CATEGORIES.CONTACT.TYPES.EMAIL,
            props:{
                type:'personal',
                value:"joshua@marinacci.org",
            },
        },
        {
            type:CATEGORIES.CONTACT.TYPES.EMAIL,
            props:{
                type:'work',
                value:"josh@josh.earth",
            },
        }
    ])
    setProp(person,'phones',[
        {
            type:CATEGORIES.CONTACT.TYPES.PHONE,
            props: {
                type: 'personal',
                value: '707-509-9627'
            }
        }
    ])
    setProp(person,'icon','http://placekeanu.com/64/64/d')
    setProp(person,'addresses',[
        {
            type:CATEGORIES.CONTACT.TYPES.MAILING_ADDRESS,
            props: {
                type: 'home',
                street1: '4055 Eddystone Place',
                city: 'Eugene',
                state: 'OR',
                zipcode: '97404',
                country: 'USA'
            }
        }
    ])

    // setProp(task,'title',"a cool task")
    // setProp(task,'completed',true)
    // setProp(task,'notes',"this is some very long notes to read. Like super duper long. So you're goint o have to spend some time reading this.")
    return person
}

export const Default = () => {
    let [obj] = useState(() => make_task())
    return <StandardViewPanel object={obj}/>
}

export const HideProps = () => {
    let [obj] = useState(() => make_task())
    return <StandardViewPanel object={obj}
                              hide={["project",'deleted']}
    />
}

export const OrderProps = () => {
    let [obj] = useState(() => make_task())
    return <StandardViewPanel object={obj}
                              hide={['project','deleted']}
                              order={['title','notes']}
    />
}

export const GroupFields = () => {
    let [obj] = useState(() => make_contact())
    return <StandardViewPanel object={obj} order={[{
        group:true,
        names:['first','last'],
    }]}/>
}

export const CustomizeProps = () => {
    let [obj] = useState(() => make_task())
    return <StandardViewPanel object={obj}
                              order={[{group:true, names:['first','last']}]}
                              hide={["project"]}
                              custom={{
                                  'deleted':'checkmark',
                                  'completed':'checkmark',
                                  'notes':'paragraph'
                              }}
    />
}

export const CustomizedContact = () => {
    let [obj] = useState(() => make_contact())
    return <StandardViewPanel object={obj}
                              order={[
                                  { group:true, names:['first','last']}
                              ]}
                              custom={{
                                  'favorite':'star',
                                  'emails': {
                                      divider:true,
                                      expand:true,
                                      order:[
                                          { name:'type', value_label:true},
                                          { name:'value'}
                                      ],
                                  },
                                  'phones':{
                                      expand:true,
                                      divider:false,
                                      order:[
                                          { name:'type', value_label:true},
                                          { name:'value'}
                                      ],
                                  }

                              }}
    />
}

export const EmptyArrayProps = () => {
    let [obj] = useState(() => make_contact())
    setProp(obj,'emails',[])
    return <StandardViewPanel object={obj} custom={{
        emails: {
            hide_empty:true,
        },
        'addresses':{
            expand:true,
            divider:true,
            order:[
                {
                    name:'type',
                    value_label:true,
                },
                {
                    name:'street1',
                },
                {
                    name:'street2',
                },
                {
                    group:true,
                    names:['city','state','zipcode','country']
                }
            ],
        },
        'phones':{
            divider:true,
            expand:true,
            order:[
                { name:'type', value_label:true},
                { name:'value'}
            ],
        }
    }}/>
}

export const CustomizedBookmark = () => {
    let bk = db.make(CATEGORIES.BOOKMARKS.ID,CATEGORIES.BOOKMARKS.SCHEMAS.BOOKMARK.TYPE)
    setProp(bk,'title','My VR Projects')
    setProp(bk,'url','https://vr.josh.earth/')
    setProp(bk,'tags',['mine','all mine'])
    setProp(bk,'excerpt','nothing cool to look at here')
    return <StandardViewPanel object={bk}
          custom={{
              tags:{
                  expand:true,
              }
          }}
    />

}

export const EmptyStringProps = () =>{
    let [obj] = useState(() => make_contact())
    setProp(obj,'timezone',"")
    return <StandardViewPanel object={obj}
                              custom={{
                                  timezone: {
                                      hide_empty:true
                                  }
                              }}
    />
}