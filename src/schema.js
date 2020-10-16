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
        },
        SCHEMAS: {
            MESSAGE: {
                title:'message',
                props: {
                    sender:{
                        key:'sender',
                    },
                    receivers:{
                        key:'receivers',
                        type:'ARRAY',
                        default:[],
                        content: {
                        }
                    },
                    contents:{
                        key:'contents',
                        type:STRING,
                        default:'',
                    },
                    timestamp:{
                        key:'timestamp',
                        type:'DATE',
                    }
                }
            }
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

export function validateData(data) {
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