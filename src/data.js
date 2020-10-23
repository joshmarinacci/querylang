import sub from "date-fns/sub"
import {CATEGORIES, validateData} from './schema.js'

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
            icon:'archive',
            query_impl: {
                and:[
                    {
                        CATEGORY:CATEGORIES.TASKS.ID,
                    },
                    {
                        TYPE:CATEGORIES.TASKS.TYPES.TASK,
                    },
                    {
                        equal: {
                            prop:'archived',
                            value:true
                        }
                    }
                ]
            }
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
            icon:'trash',
            query_impl: {
                and:[
                    {
                        CATEGORY:CATEGORIES.TASKS.ID,
                    },
                    {
                        TYPE:CATEGORIES.TASKS.TYPES.TASK,
                    },
                    {
                        equal: {
                            prop:'deleted',
                            value:true
                        }
                    }
                ]
            }
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
            title: 'give the cats fleameds',
            repeats: 'never',
            start: new Date(2020,9, 8, 12+10, 0), //october 8th at 10pm
            duration:"",//15 minutes
        }
    },
    {
        id:19,
        category: CATEGORIES.CALENDAR.ID,
        type:CATEGORIES.CALENDAR.TYPES.EVENT,
        props: {
            title:'go to sleep',
            repeats: 'daily',
            start: new Date(2020, 9, 8, 12+11, 0) // every day at 11pm
        }
    },
    {
        id:1901,
        category: CATEGORIES.CALENDAR.ID,
        type:CATEGORIES.CALENDAR.TYPES.EVENT,
        props: {
            title:'interview',
            repeats: 'never',
            start: new Date(2020, 9, 14, 9, 0), // Oct 14th at 9am
            duration:"",//30 minutes
        }
    },
    {
        id:1902,
        category: CATEGORIES.CALENDAR.ID,
        type:CATEGORIES.CALENDAR.TYPES.EVENT,
        props: {
            title:'interview2',
            repeats: 'never',
            start: new Date(2020, 9, 14, 8, 0), // Oct 14th at 9am
            duration:"",//30 minutes
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
    },
    {
        id: 24,
        category: CATEGORIES.NOTES.ID,
        type: CATEGORIES.NOTES.TYPES.GROUP,
        props: {
            title: 'all',
            query: true,
            icon: 'notes',
            query_impl: {
                and: [
                    {
                        CATEGORY: CATEGORIES.NOTES.ID,
                    },
                    {
                        TYPE: CATEGORIES.NOTES.TYPES.NOTE,
                    },
                ]
            }
        }
    },
    {
        id: 25,
        category: CATEGORIES.NOTES.ID,
        type: CATEGORIES.NOTES.TYPES.GROUP,
        props: {
            title: 'archived',
            query: true,
            icon: 'archive',
            query_impl: {
                and: [
                    {
                        CATEGORY: CATEGORIES.NOTES.ID,
                    },
                    {
                        TYPE: CATEGORIES.NOTES.TYPES.NOTE,
                    },
                    {
                        equal: {
                            prop: 'archived',
                            value: true
                        }
                    }
                ]
            }
        }
    },
    {
        id: 26,
        category: CATEGORIES.NOTES.ID,
        type: CATEGORIES.NOTES.TYPES.GROUP,
        props: {
            title: 'trash',
            query: true,
            icon: 'trash',
            query_impl: {
                and: [
                    {
                        CATEGORY: CATEGORIES.NOTES.ID,
                    },
                    {
                        TYPE: CATEGORIES.NOTES.TYPES.NOTE,
                    },
                    {
                        equal: {
                            prop:'deleted',
                            value:true,
                        }
                    }
                ]
            }
        }
    },


    {
        id:27,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            title:'Contacts',
            appid:'ContactList',
            icon:'perm_contact_calendar'
        }
    },

    {
        id:28,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            title:'Peoplebar',
            appid:'PeopleBar',
            icon:'emoji_people'
        }
    },

    {
        id:29,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            title:'Tasks',
            appid:'TaskLists',
            icon:'add_task',
        }
    },

    {
        id:30,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            title:'Chat',
            appid:'Chat',
            icon:'chat',
        }
    },

    {
        id:31,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            title:'Calendar',
            appid:'Calendar',
            icon:'today',
        }
    },

    {
        id:32,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            title:'Notes',
            appid:'Notes',
            icon:'note',
        }
    },

]
validateData(DATA)
