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
    expect(res[0].domain).toEqual('weatherapi')
})


function PROJECT(data, ...rest) {
    return data.map(item => {
        let obj = {props:{}}
        rest.forEach(field => {
            // console.log('mapping',field)
            obj.props[field] = item.props[field]
        })
        return obj
    })
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
    res = PROJECT(res,"first","addresses")
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
    expect.assertions(1);

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
    log("name is",name)
    if(Array.isArray(name)) {
        let path = name.slice()
        let val = item
        while(path.length > 0) {
            val = val.props[path.shift()]
            log('now val is',val)
        }
        return val
    }
    return item.props[name]
}

function fetchWeather(item,conditions) {
    log("fetching weather with conditions",conditions,'from item',item)
    let q = conditions.map(cond => {
        return get_item_prop_by_name(item,cond.on.A)
    }).join(" ")
    let api_key = 'fe5dd0b0a21045f0bdd235656201411'
    let url = `http://api.weatherapi.com/v1/current.json?key=${api_key}&q=${q}`
    log("final url is",url)
    return fetch(url)
        .then(res => res.json())
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
    return Promise.all(proms)
    // log("the project is",project)
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

function RPROJECT(...args) {
    return {
        project:args,
    }
}

it("join addresses to weather",()=>{
    expect.assertions(1);

    let res = db.QUERY(AND(
        IS_CATEGORY(CATEGORIES.CONTACT.ID),
        IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON),
        IS_PROP_TRUE("favorite"),
    ))
    res = PROJECT(res,"first","addresses")
    res = EXPAND(res, "addresses")
    console.log("result is",res)

    return JOIN(res,
        AND(
            IS_DOMAIN("weather"),
            ON_EQUAL(["addresses","city"],"city"),
            ON_EQUAL(["addresses","state"],"state")
        ),
        RPROJECT("temp_c"),
    ).then(data => {
        log("final data",data)
        expect(data.length).toEqual(2)
    })


})

