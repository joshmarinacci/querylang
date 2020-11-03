import sub from "date-fns/sub"
import {CATEGORIES, validateData} from './schema.js'
import {Window} from './window.js'
import React from 'react'

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
            favorite:true,
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
            favorite:false,
            timezone:'Europe/Berlin',
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
            favorite:true,
            timezone:'Europe/Berlin',
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
            icon:'delete',
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
            icon: 'delete',
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
            icon:'perm_contact_calendar',
            window: {
                default_width: 600,
                default_height: 300,
            }
        }
    },

    {
        id:28,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            title:'Peoplebar',
            appid:'PeopleBar',
            icon:'emoji_people',
            launchbar:false,
            preload:true,
            window: {
                default_width:100,
                default_height:326,
                anchor:'top-right',
            }
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
            window: {
                default_width: 620,
                default_height: 200,
            }
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
            window: {
                default_width: 500,
                default_height: 320,
            }
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
            window: {
                default_width: 500,
                default_height: 530,
            }
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
            window: {
                default_width: 600,
                default_height: 300,
            }
        }
    },


    {
        id:33,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            title:'Alarms',
            appid:'Alarms',
            icon:'alarm',
            window: {
                default_width: 500,
                default_height: 200,
            }
        }
    },
    {
        id:34,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            title:'Email',
            appid:'Email',
            icon:'email',
            window: {
                default_width: 600,
                default_height: 400,
            }
        }
    },
    {
        id:35,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            title:'Music',
            appid:'Music',
            icon:'library_music',
            window: {
                default_width: 600,
                default_height: 300,
            }
        }
    },



    {
        id:36,
        category: CATEGORIES.ALARM.ID,
        type:CATEGORIES.ALARM.TYPES.ALARM,
        props: {
            time:new Date(0,0,0,9,55), //6am
            repeat:'none',
            enabled:true,
            title:"wake up",
            alerted:false,
        }
    },

    {
        id:37,
        category: CATEGORIES.ALARM.ID,
        type:CATEGORIES.ALARM.TYPES.ALARM,
        props: {
            time:new Date(0,0,0,12+2), //2pm
            repeat:'daily', //weekdays
            enabled:false,
            title:"afternoon coffee"
        }
    },


    {
        id:38,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.SONG,
        props: {
            title:"Heat of the Moment",
            artist:"Asia",
            album:"Greatest Hits",
            url:"https://apps.josh.earth/music/01%20Heat%20of%20the%20Moment.m4a"
        }
    },


    {
        id:39,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.SONG,
        props: {
            title:"Mamma Mia",
            artist:"A-Teens",
            album:"Greatest Hits",
            url:"https://apps.josh.earth/music/01%20Mamma%20Mia.m4a"
        }
    },



    {
        id:40,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.SONG,
        props: {
            title:"Piano Sonata #8 in C Minor, Op. 13, Pathetique",
            artist:"Arther Rubinstein",
            album:"Beethoven Sonatas",
            url:"https://apps.josh.earth/music/02%20Beethoven_%20Piano%20Sonata%20%238%20In%20C%20Minor,%20Op.%2013,%20_Path%c3%a9tique_%20-%202.%20Adagio%20Cantabile.mp3"
        }
    },



    {
        id:41,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.SONG,
        props: {
            title:"Piano Sonata #14 in C Sharp Minor, Op. 27, Moonlight",
            artist:"Arther Rubinstein",
            album:"Beethoven Sonatas",
            url:"https://apps.josh.earth/music/06%20Beethoven_%20Piano%20Sonata%20%2314%20In%20C%20Sharp%20Minor,%20Op.%2027_2,%20_Moonlight_%20-%203.%20Presto%20Agitato.mp3"
        }
    },



    {
        id:42,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.SONG,
        props: {
            title:"Piano Sonata #26 in E Flat. Les Adieux",
            artist:"Arther Rubinstein",
            album:"Beethoven Sonatas",
            url:"https://apps.josh.earth/music/10%20Beethoven_%20Piano%20Sonata%20%2326%20In%20E%20Flat,%20Op.%2081A,%20_Les%20Adieux_%20-%201.%20Adagio%20-%20Allegro.mp3"
        }
    },




    {
        id:43,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.SONG,
        props: {
            title:"Here Comes the Sun",
            artist:"The Beatles",
            album:"Abbey Road",
            url:"https://apps.josh.earth/music/07%20Here%20Comes%20The%20Sun.mp3"
        }
    },

    {
        id:44,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.SONG,
        props: {
            title:"Polythene Pam",
            artist:"The Beatles",
            album:"Abbey Road",
            url:"https://apps.josh.earth/music/12%20Polythene%20Pam.mp3"
        }
    },

    {
        id:45,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.SONG,
        props: {
            title:"She Came in Through the Bathroom Window",
            artist:"The Beatles",
            album:"Abbey Road",
            url:"https://apps.josh.earth/music/13%20She%20Came%20In%20Through%20The%20Bathroom%20Window.mp3"
        }
    },

    {
        id:46,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.SONG,
        props: {
            title:"Golden Slumbers",
            artist:"The Beatles",
            album:"Abbey Road",
            url:"https://apps.josh.earth/music/14%20Golden%20Slumbers.mp3"
        }
    },

    {
        id:47,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.SONG,
        props: {
            title:"Take On Me",
            artist:"Ah-Ha",
            album:"The Main Event",
            url:"https://apps.josh.earth/music/12%20Take%20On%20Me.m4a"
        }
    },



    {
        id:201,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.GROUP,
        props: {
            title:'Songs',
            active:true,
            query:true,
            icon:'audiotrack',
            query_impl: {
                and:[
                    {
                        CATEGORY:CATEGORIES.MUSIC.ID,
                    },
                    {
                        TYPE:CATEGORIES.MUSIC.TYPES.SONG,
                    },
                ]
            }
        }
    },

    {
        id:202,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.GROUP,
        props: {
            title:'Artists',
            active:true,
            query:true,
            icon:'person',
            query_impl: {
                and:[
                    {
                        CATEGORY:CATEGORIES.MUSIC.ID,
                    },
                    {
                        TYPE:CATEGORIES.MUSIC.TYPES.SONG,
                    },
                ]
            }
        }
    },

    {
        id:203,
        category: CATEGORIES.MUSIC.ID,
        type: CATEGORIES.MUSIC.TYPES.GROUP,
        props: {
            title:'Albums',
            active:true,
            query:true,
            icon:'album',
            query_impl: {
                and:[
                    {
                        CATEGORY:CATEGORIES.MUSIC.ID,
                    },
                    {
                        TYPE:CATEGORIES.MUSIC.TYPES.SONG,
                    },
                ]
            }
        }
    },

    {
        id:48,
        category: CATEGORIES.EMAIL.ID,
        type: CATEGORIES.EMAIL.TYPES.MESSAGE,
        props: {
            sender:"jessemarinacci@icloud.com",
            receivers:["josh@josh.earth"],
            subject:"New Lego Set!",
            body: "There's a crazy new LEGO set for us to buy.\n I can't wait!",
            read:false,
            tags:["inbox"],
            timestamp: new Date(2020,9, 8, 12+10, 0), //october 8th at 10pm
        }
    },

    {
        id:49,
        category: CATEGORIES.EMAIL.ID,
        type: CATEGORIES.EMAIL.TYPES.MESSAGE,
        props: {
            sender:"jessemarinacci@icloud.com",
            receivers:["joshua@marinacci.org","jennifer@marinacci.org"],
            subject:"Homework done",
            body: "Hi Mommy and Daddy.\nI finished my homework.",
            read:true,
            timestamp: new Date(2020,9, 8, 0+8, 0), //october 8th at 8am
            tags:["inbox"],
        }
    },

    {
        id:50,
        category: CATEGORIES.EMAIL.ID,
        type: CATEGORIES.EMAIL.TYPES.MESSAGE,
        props: {
            sender:"junk@junk.com",
            receiver:["josh@josh.earth"],
            subject:"Awesome Junk For Sale!",
            body: "Please buy our crap. It's awesome. With links!",
            read:false,
            tags:["junk"],
            timestamp: new Date(2020,9, 20, 0+2, 0), //october 20th at 2pm
        }
    },

    {
        id:51,
        category: CATEGORIES.EMAIL.ID,
        type: CATEGORIES.EMAIL.TYPES.MESSAGE,
        props: {
            sender:"jessemarinacci@icloud.com",
            receiver:["josh@josh.earth"],
            subject:"Email should be deleted",
            body: "Lets delete this email",
            read:false,
            tags:["junk","trash"],
            timestamp: new Date(2020,9, 21, 12+2, 33), //october 21st at 2:33 pm
        }
    },

    {
        id:1222,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            title:'Notifications',
            appid:'NotificationPanel',
            icon:'perm_contact_calendar',
            preload:true,
            launchbar:false,
            window: {
                default_width: 200,
                default_height: 326,
                anchor:'bottom-right',
            }
        }
    },

    {
        id:300,
        category: CATEGORIES.NOTIFICATION.ID,
        type: CATEGORIES.NOTIFICATION.TYPES.ALERT,
        props: {
            title: "launched desktop",
            icon:'info',
            read:false,
        }
    },

    {
        id:1223,
        category: CATEGORIES.APP.ID,
        type: CATEGORIES.APP.TYPES.APP,
        props: {
            title:'debug',
            appid:'DebugPanel',
            icon:'bug_report',
            window: {
                default_width: 200,
                default_height: 200,
                anchor: 'bottom-left',
            }
        }
    },

]
// validateData(DATA)
