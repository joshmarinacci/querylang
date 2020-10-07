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
    if(s.props.hasOwnProperty(key)) {
        let v = s.props[key]
        if(v === true) return "true"
        if(v === false) return "false"
    }
    return s.props[key]
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
