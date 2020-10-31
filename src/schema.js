const STRING = 'STRING'
const ENUM = 'ENUM'
const BOOLEAN = 'BOOLEAN'
const ARRAY = 'ARRAY'
const TIMESTAMP = 'TIMESTAMP'

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
                        type: ENUM,
                        values: ['personal', 'work'],
                        default: 'personal'
                    },
                    value: {
                        key: 'value',
                        type: STRING,
                        default: ''
                    }
                }
            },
            PHONE:{
                title:'phone',
                props:{
                    type: {
                        key: 'type',
                        type: ENUM,
                        values: ['personal', 'work'],
                        default: 'personal'
                    },
                    value: {
                        key: 'value',
                        type: STRING,
                        default: ''
                    }
                }
            },
            PERSON: {
                title:'Person',
                props: {
                    first: {
                        key: 'first',
                        type: STRING,
                        default: 'unnamed'
                    },
                    last: {
                        key: 'last',
                        type: STRING,
                        default: 'unnamed',
                    },
                    emails: {
                        key: 'emails',
                        type: ARRAY,
                        default: [],
                        content: {
                            type: 'EMAIL',
                        }
                    },
                    phones: {
                        key: 'phones',
                        type: ARRAY,
                        default: [],
                        content: {
                            type: 'PHONE',
                        }
                    },
                    addresses: {
                        key: 'addresses',
                        type: ARRAY,
                        default: [],
                        content: {
                            type: 'MAILING_ADDRESS',
                        }
                    },
                    favorite: {
                        key: 'favorite',
                        type: BOOLEAN,
                        default:false,
                    },
                    timezone: {
                        key:'timezone',
                        type:STRING,
                    },
                }
            },
            MAILING_ADDRESS: {
                title:'Mailing address',
                props: {
                    type: {
                        key: 'type',
                        type: ENUM,
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
                    },
                    archived:{
                        key:'archived',
                        type:BOOLEAN,
                        default:false,
                    },
                    deleted:{
                        key:'deleted',
                        type:BOOLEAN,
                        default:false,
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
                        type:ARRAY,
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
                        type:TIMESTAMP
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
            NOTE:'NOTE',
            GROUP:'GROUP',
        },
        SCHEMAS: {
            NOTE:{
                title:'note',
                props: {
                    title: {
                        key:'title',
                        type:STRING,
                        default:'untitled',
                    },
                    tags: {
                        key:'tags',
                        type: ARRAY,
                        content: {
                            type:STRING
                        },
                        default:[],
                    },
                    archived: {
                        key:'archived',
                        type: BOOLEAN,
                        default:false,
                    },
                    deleted: {
                        key:'deleted',
                        type:BOOLEAN,
                        default:false,
                    },
                    contents: {
                        key:'contents',
                        type:STRING,
                        default:'',
                    },
                    lastedited:{
                        key:'lastedited',
                        type:TIMESTAMP,
                        default:()=>Date.now(),
                    }
                }
            }
        }
    },
    APP:{
        ID:'APP',
        TYPES:{
            APP:'APP'
        },
        SCHEMAS: {
            APP: {
                title:'app',
                props: {
                    title: {
                        key:'title',
                        type:STRING,
                        default:'missing app name'
                    },
                    appid: {
                        key:'appid',
                        type:STRING,
                        default:'BrokenApp',
                    },
                    icon: {
                        key:'icon',
                        type: STRING,
                        default:"close"
                    },
                    preload: {
                        key:'preload',
                        type: BOOLEAN,
                        default: false,
                    },
                    launchbar: {
                        key:'launchbar',
                        type: BOOLEAN,
                        default: true
                    }
                }
            }
        }
    },
    ALARM:{
        ID:'ALARM',
        TYPES:{
            ALARM:'ALARM',
        },
        SCHEMAS: {
            ALARM: {
                title:'alarm',
                props: {
                    time:{
                        key:'time',
                        type:STRING,
                        default:'08:00'
                    },
                    title: {
                        key:'title',
                        type:STRING,
                        default:"Alarm",
                    },
                    repeat: {
                        key: 'type',
                        type: ENUM,
                        values: ['none', 'day'],
                        default: 'none'
                    },
                }
            }
        }
    },
    MUSIC: {
        ID:'MUSIC',
        TYPES:{
            SONG:'SONG',
            GROUP:'GROUP',
        },
        SCHEMAS: {
            SONG:{
                title:'song',
                props: {
                    title: {
                        key: 'title',
                        type: STRING,
                        default: ''
                    },
                    artist: {
                        key: 'artist',
                        type: STRING,
                        default: ''
                    },
                    album: {
                        key: 'album',
                        type: STRING,
                        default: ''
                    },
                    url: {
                        key: 'url',
                        type: STRING,
                        default: ''
                    }
                }
            }
        }
    },
    EMAIL:{
        ID:'EMAIL',
        TYPES:{
            MESSAGE:'MESSAGE'
        },
        SCHEMAS: {
            MESSAGE: {
                title:'message',
                props: {
                    sender: {
                        key: 'sender',
                        type: STRING,
                        default: "",
                    },
                    receivers:{
                        key:'receivers',
                        type: ARRAY,
                        default:[],
                        content: {
                            type: STRING,
                        }
                    },
                    subject:{
                        key:'subject',
                        type:STRING,
                        default:""
                    },
                    body:{
                        key:'body',
                        type:STRING,
                        default:""
                    },
                    read: {
                        key:'read',
                        type:BOOLEAN,
                        default:false,
                    },

                    tags:{
                        key:'tags',
                        type: ARRAY,
                        default:[],
                        content: {
                            type: STRING,
                        }

                    },
                    timestamp: {
                        key:'timestamp',
                        type: TIMESTAMP,
                        default: ()=> Date.now(),
                    }
                }
            }
        }
    },
    NOTIFICATION:{
        ID:'NOTIFICATION',
        TYPES:{
            ALERT:'ALERT'
        },
        SCHEMAS:{
            ALERT:{
                title:'ALERT',
                props: {
                    title:{
                        key:'title',
                        type: STRING,
                        default:""
                    },
                    icon: {
                        key:'icon',
                        type: STRING
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
    DESCENDING:"DESCENDING",
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
        if(o.type === CATEGORIES.APP.TYPES.APP) {
            let schema = CATEGORIES.APP.SCHEMAS.APP
            // console.log("schema is",schema)
            Object.keys(schema.props).forEach(key => {
                let sch = schema.props[key]
                // console.log(key,sch)
                if(propMissing(o,key)) {
                    // console.log("missing prop",key, 'setting', sch.default, o)
                    o.props[key] = sch.default
                }
            })
            // if(propMissing(o,'launchbar')) o.props.launchbar = true
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
    if(obj.type === CATEGORIES.ALARM.TYPES.ALARM) {
        return CATEGORIES.ALARM.SCHEMAS.ALARM.props[prop].values
    }
    return ["A",'B']
}

function findSchema(type) {
    if(!SCHEMAS[type]) throw new Error("no schema found for type",type)
    return SCHEMAS[type]
}

export function makeNewObject(type, category) {
        let obj = {
            id:Math.floor(Math.random()*1000*1000),
            type,
            category,
            props:{}
        }
        let schema = findSchema(type)
        Object.keys(schema.props).forEach(key => {
            // console.log("key ",key)
            let sc = schema.props[key]
            if(!sc.hasOwnProperty('default')) {
                console.error("schema missing default",sc)
            }
            // console.log('setting key',key,sc)
            if(sc.type === TIMESTAMP && sc.default === 'NOW') {
                obj.props[sc.key] = Date.now()
                return
            }
            obj.props[sc.key] = sc.default
        })
        // console.log("made new object of type",type,obj)
        return obj
}