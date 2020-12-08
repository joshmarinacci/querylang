import {find_city} from './services/CityInfo.js'

export const IS_DOMAIN = (domain) => ({domain})
export const ON_EQUAL = (A, B) => ({ on:{A, B  } })
export const ON_IS = (field, value) => ({ on: {field, value } })
export const PROJECT = (...args) => ({project:args})
export const EXPAND = (...args) => ({expand:args})
export const JOIN = (...args) => ({join:args})
export const NONE = () => ({none:'none'})
export const ONE  = () => ({one:'one'})
export const JOIN_SOURCE = (q, ...mapping) => ({ domain:q.domain, mapping })



function log(...args) {
    console.log(args.map(a => {
        return JSON.stringify(a,null,'  ')
    }).join("\n"))
}
function EXECUTE_AND(db,clause) {
    // log("EXECUTE_AND",clause)
    let data = []
    clause.forEach(c => {
        if (c.domain && c.domain === 'local') {
            data = db.data
            return
        }
        if(c.CATEGORY) {
            data = data.filter(it => it.category === c.CATEGORY)
        }
        if(c.TYPE) {
            data = data.filter(it => it.type === c.TYPE)
        }
        if(c.equal) {
            data = data.filter(it => it.props[c.equal.prop] === c.equal.value)
        }
    })
    // log("end of and is",data)
    return Promise.resolve(data)
}
function EXECUTE_PROJECT(db,data, ...fields) {
    // log("projection is",fields,'on data',data)
    return EXECUTE(db,data).then(data => {
        // log("real data is",data)
        data = data.map(item => {
            let obj = {props:{}}
            fields.forEach(field => {
                let dd = get_item_prop_by_name(item,field)
                obj.props[dd.key] = dd.value
            })
            return obj
        })
        return data
    })
}
function EXECUTE_EXPAND(db,data, field) {
    // log("EXECUTE_EXPAND",field,'on data',data)
    return EXECUTE(db,data).then(data => {
        let d2 = []
        data.forEach(item => {
            let vals = item.props[field]
            vals.forEach(val => {
                // console.log('value of',field,'is',val)
                let obj = {props:{}}
                Object.keys(item.props).forEach(key => {
                    if(key !== field)  obj.props[key] = item.props[key]
                })
                obj.props[field] = val;
                d2.push(obj)
                // console.log("adding",obj)
            })
        })
        return d2
    })
}
function EXECUTE_NONE() {
    // log("EXECUTE_NONE")
    return Promise.resolve([])
}
function EXECUTE_ONE() {
    // log("EXECUTE_ONE")
    return Promise.resolve([{type:'one',props:{}}])
}
function EXECUTE_JOIN(db, data, js) {
    let join_source = js
    log("EXECUTE_JOIN",join_source,'using data',data)
    return EXECUTE(db,data).then(data => {
        log("real data to join with is",data)
        log("domain is", join_source.domain)
        log("mapping is", join_source.mapping)
        let svc = null
        if (join_source.domain === 'weather') {
            log("doing a weather query")
            svc = fetchWeather
        }
        if(join_source.domain === 'cityinfo') {
            log("doing a city info query")
            svc = fetchCityInfo
        }
        if(svc) {
            return Promise.all(data.map(item => {
                return svc(item,join_source.mapping).then(ret => {
                    let item2 = {props:{}}
                    Object.keys(item.props).forEach(key => {
                        item2.props[key] = item.props[key]
                    })
                    Object.keys(ret.props).forEach(key => {
                        item2.props[key] = ret.props[key]
                    })
                    return item2
                })
            }))
        } else {
            throw new Error("unsupported JOIN domain " + join_source.domain)
        }
    })}
export function EXECUTE(db,...args) {
    let proms = args.map(arg => {
        log('EXECUTE',arg)
        if(arg.project) return EXECUTE_PROJECT(db,...arg.project)
        if(arg.expand) return EXECUTE_EXPAND(db,...arg.expand)
        if(arg.join) return EXECUTE_JOIN(db,...arg.join)
        if(arg.and) return EXECUTE_AND(db,arg.and)
        if(arg.none) return EXECUTE_NONE(db)
        if(arg.one) return EXECUTE_ONE(db)
        return Promise.resolve("nothing")
    })
    return Promise.all(proms).then(d => d.flat())
}



function get_item_prop_by_name(item, name) {
    // log("name is",name)
    if(Array.isArray(name)) {
        let path = name.slice()
        let val = item
        let lastname = name
        while(path.length > 0) {
            lastname = path.shift()
            val = val.props[lastname]
            // log('now val is',lastname,":",val)
        }
        return {
            key:lastname,
            value:val,
        }
    }
    return {
        key:name,
        value:item.props[name]
    }
}

function fetchWeather(item,conditions) {
    log("fetching weather with conditions",conditions,'from item',item)
    let q = conditions.map(cond => {
        if(cond.on.value) return cond.on.value
        return get_item_prop_by_name(item,cond.on.A).value
    }).join(" ")
    let api_key = 'fe5dd0b0a21045f0bdd235656201411'
    let url = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${q}`
    log("final url is",url)
    return fetch(url)
        .then(res => res.json())
        .catch(e => {
            log("error",e)
            return []
        })
        .then(d => {
            log("final result is",d)
            return {
                domain:'weatherapi',
                category:'weatherapi',
                type:'current',
                props:{
                    temp_c: d.current.temp_c,
                    temp_f: d.current.temp_f,
                }
            }
        })

}

function fetchCityInfo(item, mapping) {
    log("fetching city info  with mapping",mapping,'from item',item)
    let q = {}
    mapping.forEach(cond => {
        if(cond.on.value) {
            q[cond.on.field] = cond.on.value
        } else {
            q[cond.on.B] = get_item_prop_by_name(item, cond.on.A).value
        }
    })
    console.log('query is',q)
    let result = {
        type:'info',
        props:{
            timezone:'N/A'
        }
    }
    let city = find_city(q.city,q.state)
    log("found city info",city)
    result.props.timezone = city.timezone
    // if(q.city.toLowerCase() === 'eugene') {
    //     result.props.timezone = 'Pacific'
    // }
    return Promise.resolve(result)
}
