import {AND, IS_CATEGORY, IS_TYPE, query2} from './query2.js'
import {DATA} from './data.js'
import {CATEGORIES} from './schema.js'
import {project} from './db.js'

function join(list1, list2, comparator) {
    let res = []
    for(let item1 of list1) {
        for(let item2 of list2) {
            if(comparator(item1,item2)) {
                let obj = {}
                Object.keys(item1.props).forEach(key => {
                    obj[key] = item1.props[key]
                })
                Object.keys(item2).forEach(key => {
                    obj[key] = item2[key]
                })
                res.push(obj)
            }
        }
    }
    return res
}

function project2(matches, strings) {
    return matches.map(o => {
        let keys = Object.keys(o).filter(k => strings.indexOf(k)>=0)
        let o2 = {}
        keys.forEach(k => o2[k] = o[k])
        return o2;
    })
}

test('find all contacts', () => {

    //find all chat messages
    let res = query2(DATA,AND(
        IS_CATEGORY(CATEGORIES.CONTACT.ID),
        IS_TYPE(CATEGORIES.CONTACT.TYPES.PERSON)
    ))
    // console.log("contacts is",res.length,res)
    let addrs = project(res,['addresses','first','last'])
        //get rid of ones with no addresses
        .filter(o => o.props.addresses !== undefined)
    console.log("addres",addrs)


    let url = "https://api.silly.io/api/list/9eccf847-8e4c-437f-a538-dfa4943de679?format=json"
    return fetch(url).then(r => r.json()).then(data => {
        let matches = data.items.filter(item => item.abbreviation === 'OR')
        // project only those two props
        matches = project2(matches,['abbreviation','motto'])
        console.log("matches are",matches)
        // join the two arrays where state === abbreviation
        let combined = join(addrs,matches,(a,b)=>{
            return a.props.addresses.some(addr => addr.props.state === b.abbreviation)
        })
        console.log('mottos for my contacts are',combined)
        combined.forEach(obj => {
            console.log(`the motto for ${obj.first}'s state ${obj.abbreviation} is ${obj.motto}`)
        })

    })
});
