import {hourAsDateString} from './db.js'

export const CATEGORIES = {
    CONTACT:{
        ID:'CONTACT',
        TYPES:{
            PERSON:'PERSON',
            EMAIL:'EMAIL',
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
            PERSON: {
                title:'Person',
                props:  [
                    {
                        key:'first',
                        type:'STRING',
                        default:''
                    },
                    {
                        key:'last',
                        type:'STRING',
                        default:'',
                    },
                    {
                        key:'emails',
                        type:'ARRAY',
                        content:{
                            type:'EMAIL',
                        }
                    }
                ]
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
            phone:[
                {
                    type:'cell',
                    value:'707-509-9627'
                }
            ],
            icon:'http://placekeanu.com/64/64/d',
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
        }
    },
    {
        id:7,
        category: CATEGORIES.TASKS.ID,
        type: CATEGORIES.TASKS.TYPES.PROJECT,
        props: {
            title:'personal',
            active:true,
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
            notes:'make sure to check the math before submitting'
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
            contents: "this is my first long note to read."
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
            contents:'This would be an epic story idea'
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
            contents:'the really old one'
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
            lastedited:10,
        }
    }
]


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
            if(propMissing(o,'emails')) {
                o.props.emails = []
            }
        }
    })
}
validateData(DATA)




export function getEnumPropValues(obj,prop) {
    if(obj.type === CATEGORIES.CONTACT.TYPES.EMAIL) {
        return CATEGORIES.CONTACT.SCHEMAS.EMAIL.props[prop].values
    }
    return ["A",'B']
}

export function makeNewObject(type) {
    if(type === CATEGORIES.CONTACT.TYPES.EMAIL) {
        let obj = {
            type:type,
            props:{},
            id:Math.floor(Math.random()*1000*1000),
        }
        let schema = CATEGORIES.CONTACT.SCHEMAS.EMAIL
        Object.keys(schema.props).forEach(key => {
            let sc = schema.props[key]
            obj.props[sc.key] = sc.default
        })
        console.log("made new object of type",type,obj)
        return obj
    }
    if(type === CATEGORIES.NOTES.TYPES.NOTE) {
        let obj = {
            type:type,
            id:Math.floor(Math.random()*1000*1000),
            props:{}
        }
        let schema = CATEGORIES.NOTES.SCHEMAS.NOTE
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
    console.error("UNKNOWN TYPE",type)
    return null
}