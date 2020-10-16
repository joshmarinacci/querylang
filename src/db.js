import {MdAccessAlarm, MdArchive, MdDelete, MdList, MdNote} from 'react-icons/md'
import React from 'react'

export function query(data,opts) {
    if(opts.type) {
        data = data.filter(o => o.type === opts.type)
    }
    return data
}

export function sort(items,sortby,sortorder) {
    items = items.slice()
    items.sort((a,b)=>{
        let key = sortby[0]
        if(a.props[key] === b.props[key]) return 0
        if(a.props[key]>b.props[key]) return 1
        return -1
    })
    return items
}

export function project(items,propsarray) {
    return items
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
    if(value === 'archive') return <MdArchive className={'icon'}/>
    if(value === 'trash') return <MdDelete className={'icon'}/>
    if(value === 'notes') return <MdNote className={'icon'}/>
    if(value === 'list') return <MdList className={'icon'}/>
    if(value === 'hash') return <label className={'icon'}>#</label>
    return <MdAccessAlarm className={'icon blank'}/>
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
    return
}

export function hasProp(s,key) {
    return s && s.props && s.props.hasOwnProperty(key)
}
export function propAsBoolean(s, key) {
    if(!s) return false
    return new Boolean(s.props[key]).valueOf()
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
                    return
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
                return
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
                return
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



