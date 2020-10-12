import {hourAsDateString} from './db.js'
import sub from 'date-fns/sub'

const STRING = 'STRING'
const BOOLEAN = 'BOOLEAN'

export const CATEGORIES = {
    CONTACT:{
        ID:'CONTACT',
        TYPES:{
            PERSON:'PERSON',
            EMAIL:'EMAIL',
            MAILING_ADDRESS:'MAILING_ADDRESS',
            PHONE:'PHONE',
        },
        SCHEMAS:{
            EMAIL:{
                title:'email',
                props: {
                    type: {
                        key: 'type',
                        type: 'ENUM',
                        values: ['personal', 'work'],
                        default: 'personal'
                    },
                    value: {
                        key: 'value',
                        type: 'STRING',
                        default: ''
                    }
                }
            },
            PHONE:{
                title:'phone',
                props:{
                    type: {
                        key: 'type',
                        type: 'ENUM',
                        values: ['personal', 'work'],
                        default: 'personal'
                    },
                    value: {
                        key: 'value',
                        type: 'STRING',
                        default: ''
                    }
                }
            },
            PERSON: {
                title:'Person',
                props:  [
                    {
                        key:'first',
                        type:'STRING',
                        default:'unnamed'
                    },
                    {
                        key:'last',
                        type:'STRING',
                        default:'unnamed',
                    },
                    {
                        key:'emails',
                        type:'ARRAY',
                        default:[],
                        content:{
                            type:'EMAIL',
                        }
                    },
                    {
                        key:'phones',
                        type:'ARRAY',
                        default:[],
                        content: {
                            type:'PHONE',
                        }
                    },
                    {
                        key:'addresses',
                        type:'ARRAY',
                        default:[],
                        content: {
                            type:'MAILING_ADDRESS',
                        }
                    }
                ]
            },
            MAILING_ADDRESS: {
                title:'Mailing address',
                props: {
                    type: {
                        key: 'type',
                        type: 'ENUM',
                        values: ['personal', 'work'],
                        default: 'personal'
                    },
                    street1: {
                        key:'street1',
                        type:STRING,
                        default:'',
                    },
                    street2: {
                        key:'street2',
                        type:STRING,
                        default:'',
                    },
                    city: {
                        key:'city',
                        type:STRING,
                        default:'',
                    },
                    state: {
                        key:'state',
                        type:STRING,
                        default:'',
                    },
                    zipcode:{
                        key:'zipcode',
                        type:STRING,
                        default:'',
                    },
                    country: {
                        key:'country',
                        type:STRING,
                        default:'',
                    }
                }
            }
        }
    },
    GENERAL: {
        ID:'GENERAL',
        TYPES:{
            COLLECTION:'COLLECTION'
        }
    },
    TASKS: {
        ID:'TASKS',
        TYPES:{
            PROJECT: "PROJECT",
            TASK:"TASK",
        },
        SCHEMAS: {
            TASK:{
                title:'task',
                props: {
                    title:{
                        key:'title',
                        type:STRING,
                        default:'untitled'
                    },
                    project:{
                        key:'project',
                    },
                    completed:{
                        key:'completed',
                        type:BOOLEAN,
                        default:false,
                    },
                    notes: {
                        key:'notes',
                        type:STRING,
                        default:'',
                    }
                }
            }
        }
    },
    CHAT: {
        ID:'CHAT',
        TYPES:{
            MESSAGE: 'MESSAGE',
            CONVERSATION:'CONVERSATION',
        }
    },
    SETTINGS:{
        ID:'SETTINGS',
        TYPES:{
            USER:'USER'
        }
    },
    CALENDAR: {
        ID:'CALENDAR',
        TYPES: {
            EVENT:'EVENT'
        }
    },
    NOTES:{
        ID:'NOTES',
        TYPES:{
            NOTE:'NOTE'
        },
        SCHEMAS: {
            NOTE:{
                title:'note',
                props: {
                    title: {
                        key:'title',
                        type:'STRING',
                        default:'untitled',
                    },
                    tags: {
                        key:'tags',
                        type:'ARRAY',
                        content: {
                            type:'STRING'
                        },
                        default:[],
                    },
                    archived: {
                        key:'archived',
                        type:'BOOLEAN',
                        default:false,
                    },
                    deleted: {
                        key:'deleted',
                        type:'BOOLEAN',
                        default:false,
                    },
                    contents: {
                        key:'contents',
                        type:'STRING',
                        default:'',
                    },
                    lastedited:{
                        key:'lastedited',
                        type:'TIMESTAMP',
                        default:'NOW'
                    }
                }
            }
        }
    }
}
export const DATA = [
    {
        id:1,
        category:CATEGORIES.CONTACT.ID,
        type:CATEGORIES.CONTACT.TYPES.PERSON,
        props:{
            first:'Josh',
            last:'Marinacci',
            emails:[
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
            ],
            phones:[
                {
                    type:CATEGORIES.CONTACT.TYPES.PHONE,
                    props: {
                        type: 'personal',
                        value: '707-509-9627'
                    }
                }
            ],
            icon:'http://placekeanu.com/64/64/d',
            addresses:[
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
            ]
        }
    },
    {
        id:2,
        category:CATEGORIES.CONTACT.ID,
        type:CATEGORIES.CONTACT.TYPES.PERSON,
        props:{
            first:'Jesse',
            last:'Marinacci',
            emails:[
                {
                    type:CATEGORIES.CONTACT.TYPES.EMAIL,
                    props:{
                        type:'personal',
                        value:"jessemarinacci@icloud.com",
                    },
                },
                {
                    type:CATEGORIES.CONTACT.TYPES.EMAIL,
                    props: {
                        type: 'school',
                        value: "jesse.marinacci@bsd52.org",
                    }
                }
            ],
            icon:'http://placekeanu.com/64/64/a',
        }
    },
    {
        id:3,
        category: CATEGORIES.CONTACT.ID,
        type:CATEGORIES.CONTACT.TYPES.PERSON,
        props: {
            first:'Cocoa',
            last:'',
            icon:'https://placekitten.com/64/65',
        }
    },
    {
        id:4,
        category: CATEGORIES.CONTACT.ID,
        type:CATEGORIES.CONTACT.TYPES.PERSON,
        props: {
            first:'Oreo',
            last:'',
            icon:'https://placekitten.com/64/64',
        }
    },
    {
        id:5,
        category: CATEGORIES.GENERAL.ID,
        type:CATEGORIES.GENERAL.TYPES.COLLECTION,
        props: {
            set:[1,3,2],
            name:'peoplebar'
        }
    },
    {
        id:6,
        category: CATEGORIES.TASKS.ID,
        type: CATEGORIES.TASKS.TYPES.PROJECT,
        props: {
            title:'work',
            active:true,
            icon: 'list',
        }
    },
    {
        id:7,
        category: CATEGORIES.TASKS.ID,
        type: CATEGORIES.TASKS.TYPES.PROJECT,
        props: {
            title:'personal',
            active:true,
            icon: 'list',
        }
    },
    {
        id:117,
        category: CATEGORIES.TASKS.ID,
        type: CATEGORIES.TASKS.TYPES.PROJECT,
        props: {
            title:'archive',
            active:true,
            query:true,
            icon:'archive'
        }
    },
    {
        id:118,
        category: CATEGORIES.TASKS.ID,
        type: CATEGORIES.TASKS.TYPES.PROJECT,
        props: {
            title:'trash',
            active:true,
            query:true,
            icon:'trash'
        }
    },
    {
        id:8,
        category: CATEGORIES.TASKS.ID,
        type: CATEGORIES.TASKS.TYPES.PROJECT,
        props: {
            title:'old stuff',
            active:false,
        }
    },
    {
        id:9,
        category: CATEGORIES.TASKS.ID,
        type: CATEGORIES.TASKS.TYPES.TASK,
        props: {
            title:'file expense report',
            project:6,
            completed:false,
            notes:'make sure to check the math before submitting',
            archived:false,
            deleted:false,
        },
    },
    {
        id:10,
        category: CATEGORIES.TASKS.ID,
        type: CATEGORIES.TASKS.TYPES.TASK,
        props: {
            title:'pick up jesse',
            project:7,
            completed:true,
            archived:false,
            deleted:false,
        },
    },
    {
        id:101,
        category: CATEGORIES.TASKS.ID,
        type: CATEGORIES.TASKS.TYPES.TASK,
        props: {
            title:'an archived task',
            project:6,
            completed:true,
            archived:true,
            deleted:false,
        },
    },
    {
        id:102,
        category: CATEGORIES.TASKS.ID,
        type: CATEGORIES.TASKS.TYPES.TASK,
        props: {
            title:'a deleted task',
            project:6,
            completed:true,
            archived:false,
            deleted:true,
        },
    },
    {
        id:11,
        category: CATEGORIES.CHAT.ID,
        type: CATEGORIES.CHAT.TYPES.MESSAGE,
        props: {
            sender:1,
            receivers:[1,2,3],
            contents:'hi jesse',
            timestamp:2
        }
    },
    {
        id:12,
        category: CATEGORIES.CHAT.ID,
        type: CATEGORIES.CHAT.TYPES.MESSAGE,
        props: {
            sender:2,
            receivers:[1,2,3],
            contents:'hi daddy',
            timestamp:1
        }
    },
    {
        id:13,
        category: CATEGORIES.CHAT.ID,
        type: CATEGORIES.CHAT.TYPES.MESSAGE,
        props: {
            sender:3,
            receivers:[1,2,3],
            contents:'meow',
            timestamp:5,
        }
    },
    {
        id:14,
        category: CATEGORIES.CHAT.ID,
        type: CATEGORIES.CHAT.TYPES.CONVERSATION,
        props: {
            title:"cat chat",
            people:[1,2,3],
        }
    },
    {
        id:15,
        category: CATEGORIES.CHAT.ID,
        type: CATEGORIES.CHAT.TYPES.CONVERSATION,
        props: {
            title:"kid chat",
            people:[1,2],
        }
    },
    {
        id:16,
        category: CATEGORIES.CHAT.ID,
        type: CATEGORIES.CHAT.TYPES.MESSAGE,
        props: {
            sender:1,
            receivers:[1,2],
            contents:'have you done your homework?',
            timestamp:5,
        }
    },
    {
        id:17,
        category: CATEGORIES.SETTINGS.ID,
        type: CATEGORIES.CHAT.TYPES.MESSAGE,
        props: {
            contact:1, // contact card ID
        }
    },
    {
        id:18,
        category:CATEGORIES.CALENDAR.ID,
        type:CATEGORIES.CALENDAR.TYPES.EVENT,
        props: {
            title: 'flea meds',
            start:hourAsDateString(8),
        }
    },
    {
        id:19,
        category: CATEGORIES.CALENDAR.ID,
        type:CATEGORIES.CALENDAR.TYPES.EVENT,
        props: {
            title:'go to sleep',
            start:hourAsDateString(23)
        }
    },
    {
        id:20,
        category: CATEGORIES.NOTES.ID,
        type:CATEGORIES.NOTES.TYPES.NOTE,
        props: {
            title:'brainstorm',
            tags:['cool','thinking','bad'],
            archived:false,
            deleted:false,
            contents: "this is my first long note to read.",
            lastedited: sub(Date.now(),{days:3})
        }
    },
    {
        id:21,
        category: CATEGORIES.NOTES.ID,
        type:CATEGORIES.NOTES.TYPES.NOTE,
        props: {
            title:'story ideas',
            tags:['thinking'],
            archived:false,
            deleted:false,
            contents:'This would be an epic story idea',
            lastedited: sub(Date.now(),{days:5})
        }
    },
    {
        id:22,
        category: CATEGORIES.NOTES.ID,
        type:CATEGORIES.NOTES.TYPES.NOTE,
        props: {
            title:'an old archived note',
            tags:['thinking'],
            archived: true,
            deleted: false,
            contents:'the really old one',
            lastedited: sub(Date.now(),{days:0})
        }
    },
    {
        id:23,
        category: CATEGORIES.NOTES.ID,
        type:CATEGORIES.NOTES.TYPES.NOTE,
        props: {
            title:'a deleted note',
            tags:['thinking'],
            archived: true,
            deleted: true,
            contents:'in the bin!',
            lastedited: sub(Date.now(),{days:85})
        }
    }
]


const SCHEMAS = {}
Object.values(CATEGORIES).forEach(val => {
    if(val.SCHEMAS) {
        Object.keys(val.SCHEMAS).forEach(key => {
            let schema = val.SCHEMAS[key]
            SCHEMAS[key] = schema
        })
    }
})

export const SORTS = {
    ASCENDING:"ASCENDING",
}

function propMissing(obj, key) {
    if(!obj) return true
    if(!obj.props) return true
    if(!obj.props.hasOwnProperty(key)) return true
    return false
}

function validateData(data) {
    data.forEach(o => {
        if(o.type === CATEGORIES.TASKS.TYPES.TASK) {
            if(!o.props.hasOwnProperty('notes')) {
                console.log("missing a note")
                o.props.notes = ''
            }
        }
        if(o.type === CATEGORIES.CONTACT.TYPES.PERSON) {
            if(propMissing(o,'emails')) o.props.emails = []
            if(propMissing(o,'phones')) o.props.phones = []
            if(propMissing(o,'addresses')) o.props.addresses = []
        }
    })
}
validateData(DATA)




export function getEnumPropValues(obj,prop) {
    console.log("looking up values for",obj,prop)
    if(obj.type === CATEGORIES.CONTACT.TYPES.EMAIL) {
        return CATEGORIES.CONTACT.SCHEMAS.EMAIL.props[prop].values
    }
    if(obj.type === CATEGORIES.CONTACT.TYPES.PHONE) {
        return CATEGORIES.CONTACT.SCHEMAS.PHONE.props[prop].values
    }
    if(obj.type === CATEGORIES.CONTACT.TYPES.MAILING_ADDRESS) {
        return CATEGORIES.CONTACT.SCHEMAS.MAILING_ADDRESS.props[prop].values
    }
    return ["A",'B']
}

function findSchema(type) {
    if(!SCHEMAS[type]) throw new Error("no schema found for type",type)
    return SCHEMAS[type]
}

export function makeNewObject(type) {
        let obj = {
            type:type,
            id:Math.floor(Math.random()*1000*1000),
            props:{}
        }
        let schema = findSchema(type)
        Object.keys(schema.props).forEach(key => {
            let sc = schema.props[key]
            if(!sc.hasOwnProperty('default')) {
                console.error("schema missing default",sc)
            }
            console.log('setting key',key,sc)
            if(sc.type === 'TIMESTAMP' && sc.default === 'NOW') {
                obj.props[sc.key] = Date.now()
                return
            }
            obj.props[sc.key] = sc.default
        })
        console.log("made new object of type",type,obj)
        return obj
}