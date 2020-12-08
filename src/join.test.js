/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';

import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_PROP_TRUE, IS_TYPE, query2} from './query2.js'
import {CATEGORIES} from './schema.js'
import {makeDB, project} from './db.js'

let db = makeDB()

it("get all favorite contacts",()=>{
    expect.assertions(2)
    let favorites = AND(
        IS_DOMAIN('local'),
        IS_CATEGORY(CATEGORIES.CONTACT.ID),
        IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON),
        IS_PROP_TRUE("favorite")
    )
    EXECUTE(favorites).then((res)=>{
        console.log("result is",res)
        expect(res.length).toEqual(2)
        expect(res[0].props.first).toEqual('Jesse')
    })

})
it("project addresses and first names",()=>{
    expect.assertions(1)
    return EXECUTE(
        PEXPAND(
            PPROJECT(
                AND(
                    IS_DOMAIN('local'),
                    IS_CATEGORY(CATEGORIES.CONTACT.ID),
                    IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON),
                    IS_PROP_TRUE("favorite"),
                ),
                "first",
                "addresses"
            ),
            "addresses",
        )
    ).then(res => {
        log("result is",res)
        expect(res.length).toEqual(2)
    })
})
it("fetch weather for city", () => {
    expect.assertions(1);
    return EXECUTE(PJOIN(
        ONE(),
        JOIN_SOURCE(
            IS_DOMAIN("weather"),
            ON_IS("city","Eugene"),
            ON_IS("state","OR"),
        )
    )).then(res => {
        console.log("result is",res)
        expect(res.length).toEqual(1)
    })
})

function log(...args) {
    console.log(args.map(a => {
        return JSON.stringify(a,null,'  ')
    }).join("\n"))
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
    if(q.city.toLowerCase() === 'eugene') {
        result.props.timezone = 'Pacific'
    }
    return Promise.resolve(result)
}
function IS_DOMAIN(domain) {
    return {
        domain:domain,
    }
}

function ON_EQUAL(city, city2) {
    return {
        on:{
            A:city,
            B:city2
        }
    }
}
function ON_IS(field, value) {
    return {
        on:{
            field:field,
            value:value,
        }
    }
}
it("join addresses to weather",()=>{
    expect.assertions(2);
    let favs = AND(
        IS_DOMAIN('local'),
        IS_CATEGORY(CATEGORIES.CONTACT.ID),
        IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON),
        IS_PROP_TRUE("favorite"),
    )
    let clean_favs = PEXPAND(PPROJECT(favs,"first",'addresses'),'addresses')
    let with_weather = PJOIN(clean_favs, JOIN_SOURCE(
        IS_DOMAIN("weather"),
        ON_EQUAL(["addresses","city"],"city"),
        ON_EQUAL(["addresses","state"],"state")
    ))
    return EXECUTE(with_weather).then(data => {
        log("final data",data)
        expect(data.length).toEqual(2)
        expect(data[0].props.first).toEqual("Jesse")
    })
})


function EXECUTE_AND(clause) {
    log("EXECUTE_AND",clause)
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
    log("end of and is",data)
    return Promise.resolve(data)
}
function EXECUTE_PROJECT(data, ...fields) {
    log("projection is",fields,'on data',data)
    return EXECUTE(data).then(data => {
        log("real data is",data)
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
function EXECUTE_EXPAND(data, field) {
    log("EXECUTE_EXPAND",field,'on data',data)
    return EXECUTE(data).then(data => {
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
    log("EXECUTE_NONE")
    return Promise.resolve([])
}
function EXECUTE_ONE() {
    log("EXECUTE_ONE")
    return Promise.resolve([{type:'one',props:{}}])
}
function EXECUTE_JOIN(data, join_source) {
    log("EXECUTE_JOIN",join_source.join_source,'using data',data)
    return EXECUTE(data).then(data => {
        log("real data to join with is",data)
        log("domain is", join_source.join_source.domain.domain)
        log("mapping is", join_source.join_source.mapping)
        let svc = null
        if (join_source.join_source.domain.domain === 'weather') {
            log("doing a weather query")
            svc = fetchWeather
        }
        if(join_source.join_source.domain.domain === 'cityinfo') {
            log("doing a city info query")
            svc = fetchCityInfo
        }
        if(svc) {
            return Promise.all(data.map(item => {
                return svc(item,join_source.join_source.mapping).then(ret => {
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
            throw new Error("unsupported JOIN domain " + join_source.join_source.domain.domain)
        }
    })}
function EXECUTE(...args) {
    let proms = args.map(arg => {
        log('EXECUTE',arg)
        if(arg.project) return EXECUTE_PROJECT(...arg.project)
        if(arg.expand) return EXECUTE_EXPAND(...arg.expand)
        if(arg.join) return EXECUTE_JOIN(...arg.join)
        if(arg.and) return EXECUTE_AND(arg.and)
        if(arg.none) return EXECUTE_NONE()
        if(arg.one) return EXECUTE_ONE()
        return Promise.resolve("nothing")
    })
    return Promise.all(proms).then(d => d.flat())
}

const PPROJECT = (...args) => ({project:args})
const PEXPAND = (...args) => ({expand:args})
const PJOIN = (...args) => ({join:args})
const NONE = () => ({none:'none'})
const ONE  = () => ({one:'one'})

function JOIN_SOURCE(isdomain, ...mapping) {
   return {
       join_source:{
           domain:isdomain,
           mapping:mapping
       }}
}

it("join addresses to city info server",()=>{
    expect.assertions(2);
    let favorites = AND(
                IS_DOMAIN('local'),
                IS_CATEGORY(CATEGORIES.CONTACT.ID),
                IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON),
                IS_PROP_TRUE("favorite")
            )
    // return EXECUTE(favorites).then(data => {
    //     log("favorites",data)
    //     expect(data.length).toEqual(2)
    //     expect(data[0].props.first).toEqual("Jesse")
    // })
    let just_names_and_addresses = PPROJECT(favorites,'first','addresses')
    // return EXECUTE(just_names_and_addresses).then(data => {
    //     log("just names and addresses",data)
    //     expect(data.length).toEqual(2)
    //     expect(data[0].props.first).toEqual("Jesse")
    // })
    let expanded_addresses = PEXPAND(just_names_and_addresses,"addresses")
    // return EXECUTE(expanded_addresses).then(data => {
    //     log("expanded addresses is", data)
    //     expect(data.length).toEqual(2)
    //     expect(data[0].props.first).toEqual("Jesse")
    // })

    let none = NONE()
    // return EXECUTE(none).then(data => {
    //     log("none data is",data)
    //     expect(data.length).toEqual(0)
    //     expect(data.length).toEqual(0)
    // })

    let static_weather = PJOIN(
        ONE(),
        JOIN_SOURCE(
            IS_DOMAIN("weather"),
            ON_IS("city","Atlanta"),
            ON_IS("state","GA"),
            // ON_EQUAL(["addresses","city"],"city"),
            // ON_EQUAL(["addresses","state"],"state")
        )
    )
    // return EXECUTE(static_weather).then(data => {
    //     log("static weather data is",data)
    //     expect(data.length).toEqual(1)
    //     expect(data[0].type).toEqual("current")
    // })

    let dynamic_weather = PJOIN(
        expanded_addresses,
        JOIN_SOURCE(
            IS_DOMAIN("weather"),
            ON_EQUAL(['addresses','city'],'city'),
            ON_EQUAL(['addresses','state'],'state'),
        )
    )
    // return EXECUTE(dynamic_weather).then(data => {
    //     log("dynamic weather data is",data)
    //     expect(data.length).toEqual(2)
    //     expect(data[0].type).toEqual("current")
    // })

    let dynamic_timezones = PJOIN(
        expanded_addresses,
        JOIN_SOURCE(
            IS_DOMAIN("cityinfo"),
            ON_EQUAL(['addresses','city'],'city'),
            ON_EQUAL(['addresses','state'],'state'),
        )
    )
    return EXECUTE(dynamic_timezones).then(data => {
        log("dynamic timezone data is",data)
        expect(data.length).toEqual(2)
        // expect(data[0].type).toEqual("info")
        expect(data[0].props.timezone).toEqual("Pacific")
    })
})

