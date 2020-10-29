import {MdAccessAlarm, MdArchive, MdDelete, MdList, MdNote} from 'react-icons/md'
import React, {useEffect, useState} from 'react'
import {DATA} from './data.js'
import {query2} from './query2.js'
import {CATEGORIES, makeNewObject, SORTS} from './schema.js'
import Icon from '@material-ui/core/Icon'
import {compareAsc, compareDesc} from "date-fns"

export function sort(items,sortby,sortorder) {
    if(!Array.isArray(sortby)) throw new Error("sort(items, sortby) sortby must be an array of key names")
    items = items.slice()
    items.sort((A,B)=>{
        let key = sortby[0]
        let a = A.props[key]
        let b = B.props[key]
        // console.log("a,b",key,A,B,a,b)

        //date sort
        // console.log("is date",a instanceof Date)
        if(a instanceof Date) {
            if(sortorder === SORTS.DESCENDING) {
                return compareDesc(a,b)
            } else {
                return compareAsc(a,b)
            }
        }

        if(A.props[key] === B.props[key]) return 0
        if(A.props[key]>B.props[key]) return 1
        return -1
    })
    return items
}

export function project(items,propsarray=[]) {
    return items.map(o => {
        let oo = {
            id:Math.floor(Math.random()*1000*1000),
            props:{}}
        propsarray.forEach(p=>{
            if(hasProp(o,p)) {
                oo.props[p] = o.props[p]
            }
        })
        return oo
    })
}

export function propAsString(s, key) {
    if(!s) return "--missing--"
    if(!s.props) {
        if(s.hasOwnProperty(key)) {
            return s[key]
        }
        return 'no props'
    }
    if(s.props.hasOwnProperty(key)) {
        let v = s.props[key]
        if(v === true) return "true"
        if(v === false) return "false"
    } else {
        return ""
    }
    return s.props[key]
}

export function propAsIcon(s, key) {
    if(!s || !s.props || !s.props.hasOwnProperty(key) ) return <MdAccessAlarm className={'icon blank'}/>
    let value = s.props[key]
    if(value === 'hash') return <label className={'icon'}>#</label>
    return <Icon>{value}</Icon>
}

export function setProp(obj,key,value) {
    if(!obj) return
    if(!obj.hasOwnProperty('props')) {
        if(obj.hasOwnProperty(key)) {
            obj[key] = value
            return
        }
        return
    }
    obj.props[key] = value

}

export function hasProp(s,key) {
    return s && s.props && s.props.hasOwnProperty(key)
}

export function propAsBoolean(s, key) {
    if(!s) return false
    return Boolean(s.props[key]).valueOf()
}

export function stringAsBoolean(str) {
    if(str.toLowerCase() === 'false') return false
    if(str.toLowerCase() === 'on') return true
    return true
}

export function propAsArray(s, key) {
    if(!s || !s.props || !s.props.hasOwnProperty(key)) return []
    let arr = s.props[key]
    if(Array.isArray(arr)) {
        return arr
    } else {
        return []
    }
}

export function filter(list,opts) {
    return list.filter(o => {
        let pass = true
        Object.keys(opts).forEach(k=>{
            let fv = opts[k]
            // console.log("key",k,o.props[k],'value',v)
            if(!o.props.hasOwnProperty(k)) {
                pass = false
                return
            }
            let ov = o.props[k]
            if(Array.isArray(ov)) {
                if(ov.length !== fv.length) {
                    pass = false
                    return
                }
                for(let i=0; i<ov.length; i++) {
                    if(ov[i] !== fv[i]) {
                        pass = false
                        return
                    }
                }
            } else {
                if (ov !== fv) {
                    pass = false

                }
            }
            // console.log("matched")
        })
        return pass
    })
}
export function filterSubstring(list,opts) {
    return list.filter(o => {
        let pass = true
        Object.keys(opts).forEach(k=>{
            let fv = opts[k]
            if(!o.props.hasOwnProperty(k)) {
                pass = false
                return
            }
            let ov = o.props[k]
            if (!ov.toLowerCase().includes(fv.toLowerCase())) {
                pass = false

            }
        })
        return pass
    })
}

export function filterPropArrayContains(list,opts) {
    return list.filter(o => {
        let pass = true
        Object.keys(opts).forEach(k=>{
            let fv = opts[k]
            if(!o.props.hasOwnProperty(k)) {
                pass = false
                return
            }
            let ov = o.props[k]
            if(!Array.isArray(ov)) {
                pass = false
                return
            }
            if(!ov.includes(fv)) {
                pass = false

            }
        })
        return pass
    })

}

export function find_in_collection(coll,data) {
    return data.filter(o => coll.props.set.some(id=>id===o.id))
}

export function deepClone(v) {
    return JSON.parse(JSON.stringify(v))
}

export function attach(A, B, ka, kb) {
    let data = deepClone(A)
    data.forEach(a => {
        B.forEach(b => {
            let av = a.props[ka]
            let bv = b.props[kb]
            if(kb === 'id') bv = b.id
            // p("comparing",av,bv)
            if(av === bv) {
                // console.log("found a match")
                a.props[ka] = b
            }
        })
    })
    return data
}

export function attach_in(A, B, ka, kb) {
    let data = deepClone(A)
    data.forEach(a => {
        a.props[ka] = a.props[ka].map(av => {
            let ret = null
            B.forEach(b => {
                let bv = b.props[kb]
                if(kb === 'id') bv = b.id
                if(av === bv) ret = b
            })
            return ret
        })
    })
    return data
}


class DB {
    constructor(DATA) {
        this.data = DATA
        this.listeners = {}
        Object.keys(CATEGORIES).forEach(cat => this.listeners[cat] = [])
    }
    addEventListener(cat,listener) {
        if(!cat) throw new Error("Missing category")
        this.listeners[cat].push(listener)
    }
    removeEventListener(cat,listener) {
        if(!cat) throw new Error("Missing category")
        this.listeners[cat] = this.listeners[cat].filter(l => l !== listener)
    }
    QUERY(...args) {
        return query2(this.data,...args)
    }
    add(obj) {
        this.data.push(obj)
        this._fireUpdate(obj)
    }
    make(category,type) {
        return makeNewObject(type,category)
    }
    setProp(obj,key,value) {
        if(!obj) return
        if(!obj.hasOwnProperty('props')) {
            if(obj.hasOwnProperty(key)) {
                obj[key] = value
                return
            }
            return
        }
        obj.props[key] = value
        this._fireUpdate(obj)
    }

    _fireUpdate(obj) {
        this.listeners[obj.category].forEach(l => l())
    }
}

export function makeDB() {
    return new DB(DATA)
}


export function useDBChanged(db,cat) {
    if(!cat) throw new Error("missing category to monitor")
    let [refresh, setRefresh] = useState(false)
    const dbChanged = () => {
        console.log("useDBChanged: changed")
        setRefresh(!refresh)
    }
    useEffect(()=>{
        db.addEventListener(cat,dbChanged)
        return ()=>{
            db.removeEventListener(cat,dbChanged)
        }
    })
}
