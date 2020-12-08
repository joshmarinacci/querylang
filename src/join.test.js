/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom/extend-expect';

import {AND, IS_CATEGORY, IS_PROP_TRUE, IS_TYPE} from './query2.js'
import {CATEGORIES} from './schema.js'
import {makeDB} from './db.js'
import {EXECUTE, EXPAND, IS_DOMAIN, JOIN, JOIN_SOURCE, NONE, ON_EQUAL, ON_IS, ONE, PROJECT} from './query3.js'

let db = makeDB()

it("get all favorite contacts",()=>{
    expect.assertions(2)
    let favorites = AND(
        IS_DOMAIN('local'),
        IS_CATEGORY(CATEGORIES.CONTACT.ID),
        IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON),
        IS_PROP_TRUE("favorite")
    )
    EXECUTE(db,favorites).then((res)=>{
        // console.log("result is",res)
        expect(res.length).toEqual(2)
        expect(res[0].props.first).toEqual('Jesse')
    })

})
it("project addresses and first names",()=>{
    expect.assertions(1)
    return EXECUTE(db,
        EXPAND(
            PROJECT(
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
        // log("result is",res)
        expect(res.length).toEqual(2)
    })
})
it("fetch weather for city", () => {
    expect.assertions(1);
    return EXECUTE(db,JOIN(
        ONE(),
        JOIN_SOURCE(
            IS_DOMAIN("weather"),
            ON_IS("city","Eugene"),
            ON_IS("state","OR"),
        )
    )).then(res => {
        // console.log("result is",res)
        expect(res.length).toEqual(1)
    })
})

function log(...args) {
    console.log(args.map(a => {
        return JSON.stringify(a,null,'  ')
    }).join("\n"))
}

it("join addresses to weather",()=>{
    expect.assertions(2);
    let favs = AND(
        IS_DOMAIN('local'),
        IS_CATEGORY(CATEGORIES.CONTACT.ID),
        IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON),
        IS_PROP_TRUE("favorite"),
    )
    let clean_favs = EXPAND(PROJECT(favs,"first",'addresses'),'addresses')
    let with_weather = JOIN(clean_favs, JOIN_SOURCE(
        IS_DOMAIN("weather"),
        ON_EQUAL(["addresses","city"],"city"),
        ON_EQUAL(["addresses","state"],"state")
    ))
    return EXECUTE(db,with_weather).then(data => {
        // log("final data",data)
        expect(data.length).toEqual(2)
        expect(data[0].props.first).toEqual("Jesse")
    })
})




it("join addresses to city info server",()=>{
    expect.assertions(2);
    let favorites = AND(
                IS_DOMAIN('local'),
                IS_CATEGORY(CATEGORIES.CONTACT.ID),
                IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON),
                IS_PROP_TRUE("favorite")
            )
    // return EXECUTE(db,favorites).then(data => {
    //     log("favorites",data)
    //     expect(data.length).toEqual(2)
    //     expect(data[0].props.first).toEqual("Jesse")
    // })
    let just_names_and_addresses = PROJECT(favorites,'first','addresses')
    // return EXECUTE(db,just_names_and_addresses).then(data => {
    //     log("just names and addresses",data)
    //     expect(data.length).toEqual(2)
    //     expect(data[0].props.first).toEqual("Jesse")
    // })
    let expanded_addresses = EXPAND(just_names_and_addresses,"addresses")
    // return EXECUTE(db,expanded_addresses).then(data => {
    //     log("expanded addresses is", data)
    //     expect(data.length).toEqual(2)
    //     expect(data[0].props.first).toEqual("Jesse")
    // })

    let none = NONE()
    // return EXECUTE(db,none).then(data => {
    //     log("none data is",data)
    //     expect(data.length).toEqual(0)
    //     expect(data.length).toEqual(0)
    // })

    let static_weather = JOIN(
        ONE(),
        JOIN_SOURCE(
            IS_DOMAIN("weather"),
            ON_IS("city","Atlanta"),
            ON_IS("state","GA"),
            // ON_EQUAL(["addresses","city"],"city"),
            // ON_EQUAL(["addresses","state"],"state")
        )
    )
    // return EXECUTE(db,static_weather).then(data => {
    //     log("static weather data is",data)
    //     expect(data.length).toEqual(1)
    //     expect(data[0].type).toEqual("current")
    // })

    let dynamic_weather = JOIN(
        expanded_addresses,
        JOIN_SOURCE(
            IS_DOMAIN("weather"),
            ON_EQUAL(['addresses','city'],'city'),
            ON_EQUAL(['addresses','state'],'state'),
        )
    )
    // return EXECUTE(db,dynamic_weather).then(data => {
    //     log("dynamic weather data is",data)
    //     expect(data.length).toEqual(2)
    //     expect(data[0].type).toEqual("current")
    // })

    let dynamic_timezones = JOIN(
        expanded_addresses,
        JOIN_SOURCE(
            IS_DOMAIN("cityinfo"),
            ON_EQUAL(['addresses','city'],'city'),
            ON_EQUAL(['addresses','state'],'state'),
        )
    )
    return EXECUTE(db,dynamic_timezones).then(data => {
        log("dynamic timezone data is",data)
        expect(data.length).toEqual(2)
        // expect(data[0].type).toEqual("info")
        expect(data[0].props.timezone).toEqual("UTC-08")
    })
})

