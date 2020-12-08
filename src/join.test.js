/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';

import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_PROP_TRUE, IS_TYPE, query2} from './query2.js'
import {CATEGORIES} from './schema.js'
import {makeDB, project} from './db.js'

let db = makeDB()

it('get all contacts', () => {
    let res = db.QUERY(AND(
        IS_CATEGORY(CATEGORIES.CONTACT.ID),
        IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON)
        ))
    expect(res.length).toEqual(4)
});

it("get all favorite contacts",()=>{
    let res = db.QUERY(AND(
        IS_CATEGORY(CATEGORIES.CONTACT.ID),
        IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON),
        IS_PROP_TRUE("favorite"),
    ))
    console.log("result is",res)
    expect(res.length).toEqual(2)
})


function process_project(data, projection) {
    log("projection is",projection)
    return data.map(item => {
        let obj = {props:{}}
        projection.project.forEach(field => {
            let dd = get_item_prop_by_name(item,field)
            obj.props[dd.key] = dd.value
        })
        return obj
    })

    // return data.map(item => {
        // let obj = {props:{}}
        // rest.forEach(field => {
        //     obj.props[field] = item.props[field]
        // })
        // return obj
    // })
}

function EXPAND(data, field) {
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
}

it("project addresses and first names",()=>{
    let res = db.QUERY(AND(
        IS_CATEGORY(CATEGORIES.CONTACT.ID),
        IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON),
        IS_PROP_TRUE("favorite"),
    ))
    res = process_project(res,PROJECT("first","addresses"))
    res = EXPAND(res, "addresses")
    console.log("result is",res)
    console.log(JSON.stringify(res,null,'  '))
    expect(res.length).toEqual(2)
})

function RQUERY(arg) {
    // console.log(arg)
    if(arg.and) {
        // console.log("is AND")
        //combine is prop equals into a query
        let q = ""
        arg.and.forEach(clause => {
            // console.log("clause is",clause)
            if(clause.equal && clause.equal.prop === 'city') {
                q += " " + clause.equal.value
            }
            if(clause.equal && clause.equal.prop === 'state') {
                q += " " + clause.equal.value
            }
        })
        let api_key = 'fe5dd0b0a21045f0bdd235656201411'
        let url = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${q}`
        console.log("final url is",url)
        return fetch(url)
            .then(res => res.json())
            .then(d => {
                console.log("final result is",d)
                return [{
                    domain:'weatherapi',
                    category:'weatherapi',
                    type:'current',
                    props:{
                        temp_c: d.current.temp_c,
                        temp_f: d.current.temp_f,
                    }
                }]
            }).catch(e => {
                console.error(e)
            })
    }
}

it("fetch weather for city",()=>{
    expect.assertions(2);

    return RQUERY(AND(
        IS_PROP_EQUAL("city",'Eugene'),
        IS_PROP_EQUAL("state","OR")
        )).then(res => {
            console.log("result is",res)
            expect(res.length).toEqual(1)
            expect(res[0].domain).toEqual("weatherapi")
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

function JOIN(data, query, project) {
    log("JOIN query",query)
    log("data is",data)
    if(!query.and) throw new Error("JOIN query should be 'and'")
    let service = null
    let conds = []
    query.and.forEach(q => {
        if(q.domain && q.domain==='weather') {
            service = fetchWeather
        }
        if(q.on) conds.push(q)
    })
    let proms = data.map(item => {
        // log("joining item",item,'with conditions',conds)
        return service(item,conds).then(res => {
            log("result from join",res)
            let item2 = {props:{}}
            Object.keys(item.props).forEach(key => {
                item2.props[key] = item.props[key]
            })
            item2.props.current = res
            return item2
        })
    })
    return Promise.all(proms).then(data => {
        return process_project(data,project)
    })
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

function PROJECT(...args) {
    return {
        project:args,
    }
}

it("join addresses to weather",()=>{
    expect.assertions(2);

    let res = db.QUERY(AND(
        IS_CATEGORY(CATEGORIES.CONTACT.ID),
        IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON),
        IS_PROP_TRUE("favorite"),
    ))
    res = process_project(res,PROJECT("first","addresses"))
    res = EXPAND(res, "addresses")
    // console.log("result is",res)
    return JOIN(res,
        AND(
            IS_DOMAIN("weather"),
            ON_EQUAL(["addresses","city"],"city"),
            ON_EQUAL(["addresses","state"],"state")
        ),
        PROJECT('first',['current',"temp_c"]),
    ).then(data => {
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
        if (join_source.join_source.domain.domain === 'weather') {
            log("doing a weather query")
            return Promise.all(data.map(item => fetchWeather(item,join_source.join_source.mapping)))
        }
        if(join_source.join_source.domain.domain === 'cityinfo') {
            log("doing a city info query")
            return Promise.all(data.map(item => fetchCityInfo(item,join_source.join_source.mapping)))
        }
        throw new Error("unsupported JOIN domain " + join_source.join_source.domain.domain )
    })
}

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

// builder functions
// const PFIND = (...args) => ({find:args})
const PPROJECT = (...args) => ({project:args})
const PEXPAND = (...args) => ({expand:args})
const PJOIN = (...args) => ({join:args})

function NONE() {
    return {none:'none'}
}
function ONE() {
    return {one:'one'}
}

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
        expect(data[0].type).toEqual("info")
        // expect(data[0].props.timezone).toEqual("Pacific")
    })
})

