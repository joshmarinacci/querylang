export const STRING = 'STRING'
export const INTEGER = 'INTEGER'
export const ENUM = 'ENUM'
export const BOOLEAN = 'BOOLEAN'
export const ARRAY = 'ARRAY'
export const TIMESTAMP = 'TIMESTAMP'

export const CATEGORIES = {
    CONTACT:{
        ID:'CONTACT',
        TITLE:'contacts',
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
                title:'person',
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
                title:'mailing address',
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
        TITLE:'tasks',
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
            },
            PROJECT: {
                title:'task project',
                props: {
                    title:{
                        key:'title',
                        type:STRING,
                        default:'untitled'
                    },
                    active:{
                        key:'active',
                        type:BOOLEAN,
                        default:false,
                    },
                    icon:{
                        key:'icon',
                        type:STRING,
                        default:'blank',
                    }
                }
            }
        }
    },
    CHAT: {
        ID:'CHAT',
        TITLE:'chat',
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
            },
            CONVERSATION: {
                title:'chat conversation',
                props: {
                    title: {
                        key:'title',
                        type:STRING,
                        default:'chats'
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
        TITLE: 'calendar',
        TYPES: {
            EVENT:'EVENT'
        },
        SCHEMAS: {
            EVENT: {
                title:'event',
                props: {
                    title: {
                        key:'title',
                        type:STRING,
                        default:'',
                    },
                    repeats:{
                        key:'repeats',
                        type: ENUM,
                        values:['never','daily']
                    },
                    start:{
                        key:'start',
                        type: TIMESTAMP,
                        default: ()=>new Date()
                    },
                }
            }
        }
    },
    NOTES:{
        ID:'NOTES',
        TITLE:'notes',
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
            },
            GROUP: {
                title:"note group",
                props: {
                    title: {
                        key:'title',
                        type:STRING,
                        default:'untitled',
                    },
                    icon: {
                        key:'icon',
                        type:STRING,
                        default:'blank'
                    }
                }
            }
        }
    },
    APP:{
        ID:'APP',
        TITLE:'apps',
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
        TITLE:'alarms',
        TYPES:{
            ALARM:'ALARM',
        },
        SCHEMAS: {
            ALARM: {
                title:'alarm',
                props: {
                    time:{
                        key:'time',
                        type:TIMESTAMP,
                        default:() => new Date(2000,0,0,8)
                    },
                    title: {
                        key:'title',
                        type:STRING,
                        default:"Alarm",
                    },
                    repeat: {
                        key: 'repeat',
                        type: ENUM,
                        values: ['none','everyday','weekdays'],
                        default: 'none',
                    },
                    enabled: {
                        key: 'enabled',
                        type:BOOLEAN,
                        default:false,
                    },
                    alerted: {
                        key:'alerted',
                        type:BOOLEAN,
                        default:false
                    }
                }
            }
        }
    },
    MUSIC: {
        ID:'MUSIC',
        TITLE:'music',
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
            },
            GROUP: {
                title:'music group',
                props: {
                    title: {
                        key: 'title',
                        type: STRING,
                        default: ''
                    },
                    active: {
                        key: 'active',
                        type: BOOLEAN,
                        default: true,
                    },
                    icon:{
                        key:'icon',
                        type:STRING,
                        default:'blank',
                    }
                }
            }
        }
    },
    EMAIL:{
        ID:'EMAIL',
        TITLE:'email',
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
        TITLE:'notifications',
        TYPES:{
            ALERT:'ALERT'
        },
        SCHEMAS:{
            ALERT:{
                title:'alert',
                props: {
                    title:{
                        key:'title',
                        type: STRING,
                        default:""
                    },
                    icon: {
                        key:'icon',
                        type: STRING,
                        default:'info',
                    },
                    read: {
                        key:'read',
                        type: BOOLEAN,
                        default:false,
                    }
                }
            }
        }
    },
    DATABROWSER:{
        ID:'DATABROWSER',
        TYPES:{
            QUERY:'QUERY',
        }
    },
    BOOKMARKS:{
        ID:"BOOKMARKS",
        SCHEMAS: {
            BOOKMARK:{
                TYPE:'BOOKMARK',
                title:"bookmark",
                props: {
                    title:{
                        key:'title',
                        type: STRING,
                        default:""
                    },
                    url:{
                        key:'url',
                        type: STRING,
                        default:""
                    },
                    tags: {
                        key:'tags',
                        type: ARRAY,
                        content: {
                            type:STRING
                        },
                        default:[],
                    },
                    excerpt: {
                        key:'excerpt',
                        type: STRING,
                        default:""
                    },
                    lastAccessed: {
                        key:'lastAccessed',
                        type: TIMESTAMP,
                        default: () => new Date()
                    }
                },
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
    function fix_with_schema(o) {
        // let schema = CATEGORIES.APP.SCHEMAS.APP
        let schema = CATEGORIES[o.category].SCHEMAS[o.type]
        // console.log("fixing",o.type, o.category, schema)
        Object.keys(schema.props).forEach(key => {
            let sch = schema.props[key]
            // console.log(key,sch)
            if(propMissing(o,key)) {
                console.warn("missing prop",key, 'setting', sch.default, o)
                o.props[key] = sch.default
            }
        })
    }

    data.forEach(o => {
        if(o.type === CATEGORIES.CONTACT.TYPES.PERSON) {
            fix_with_schema(o)
        }
        if(o.type === CATEGORIES.APP.TYPES.APP) {
            fix_with_schema(o)
        }
    })
}

export function getEnumPropValues(obj,prop) {
    // console.log("looking up values for",obj,prop)
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

export function makeNewObject(type, category, customSchema) {
    if(!type) throw new Error("makeNewObject missing type")
    if(!category) throw new Error("makeNewObject missing category")
    let schema = null
    if(customSchema) {
        schema = customSchema.SCHEMAS[type]
    } else {
        schema = findSchema(type)
    }
    if(!schema) throw new Error(`no schema found for type ${category}:${type}`)
    if(!schema.props) throw new Error(`no schema props found for type ${category}:${type}`)


    let obj = {
        id:Math.floor(Math.random()*1000*1000),
        type,
        category,
        props:{}
    }
    Object.keys(schema.props).forEach(key => {
        let sc = schema.props[key]
        if(!sc.hasOwnProperty('default')) {
            console.error("schema missing default",category,type,sc)
        }
        // console.log('setting key',key,sc)
        if(sc.type === TIMESTAMP && sc.default === 'NOW') {
            obj.props[sc.key] = Date.now()
            return
        }
        if(typeof sc.default === 'function') {
            obj.props[sc.key] = sc.default()
        } else {
            obj.props[sc.key] = sc.default
        }
    })
    // console.log("made new object of type",type,obj)
    return obj
}