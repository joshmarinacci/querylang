import React, {useContext, useEffect, useRef, useState} from 'react'
import {DBContext, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {Window} from '../ui/window.js'
import {
    AND,
    IS_CATEGORY,
    IS_PROP_EQUAL,
    IS_PROP_NOTEQUAL,
    IS_PROP_NOTSUBSTRING,
    IS_PROP_SUBSTRING,
    IS_TYPE
} from '../query2.js'
import {DataList, HBox, Panel, StandardListItem, Toolbar, VBox} from '../ui/ui.js'
import "./DataBrowser.css"
import Icon from '@material-ui/core/Icon'
import {format, parse, parseISO} from 'date-fns'

export function DataBrowser({app}) {
    let db = useContext(DBContext)
    useDBChanged(db, CATEGORIES.DATABROWSER.ID)
    let queries = db.QUERY(AND(
        IS_TYPE(CATEGORIES.DATABROWSER.TYPES.QUERY)
    ))

    const [showDialog, setShowDialog] = useState(false)

    const makeQuery = () => {
        setShowDialog(true)
    }

    return <Window app={app}>
        <VBox>
            <Toolbar>
                <button onClick={makeQuery}>make query</button>
                <input type={'search'}/>
            </Toolbar>
        <HBox>
            <DataList data={queries}
                      stringify={o=><StandardListItem title={o.props.title}/>}
            />
            <Panel>nothing selected</Panel>
            {showDialog?<QueryEditorDialog/>:""}

        </HBox>
        </VBox>
    </Window>
}

const ANY_PROP = {
    key:'any',
    title:'any',
    type:'STRING',
}
const ANY_TYPE = {
    title:'any',
    foo:'bar',
    key:'ANY',
    props:{
        any: ANY_PROP,
    }
}
const ANY_CATEGORY = {
    ID:'ANY',
    TITLE:'any',
    SCHEMAS:{
        ANY:ANY_TYPE,
    }
}
function fetch_categories() {
    return [ANY_CATEGORY].concat(Object.values(CATEGORIES))
}

function findTypeByKey(selectedCat, key) {
    if(key === ANY_TYPE.key) return ANY_TYPE
    return CATEGORIES[selectedCat.ID].SCHEMAS[key]
}

function fetch_types_by_category(cat) {
    if(!cat || !CATEGORIES[cat.ID] || !CATEGORIES[cat.ID].SCHEMAS) {
        console.warn(`CATEGORY ${cat.ID} might be missing schemas`)
        return [ANY_TYPE]
    }
    let tt = CATEGORIES[cat.ID].SCHEMAS
    let arr = Object.keys(tt).map(key => {
        tt[key].key = key
        return tt[key]
    })
    arr.unshift(ANY_TYPE)
    return arr
}

function fetch_props_for_type(type) {
    if(!type || !type.props) return []
    let arr = Object.values(type.props)
    arr.unshift(ANY_PROP)
    return arr
}

function findPropByKey(props, key) {
    return props.find(p => p.key === key)
}


function QueryEditorDialog() {
    let db = useContext(DBContext)

    let [selectedCat, setSelectedCat] = useState({})
    let [selectedType, setSelectedType] = useState({})
    // let [propQuery, setPropQuery] = useState({})
    let [predicates, setPredicates] = useState([])
    let [debug_text, set_debug_text] = useState("")

    const chooseCat = (cat) => {
        setSelectedCat(cat)
    }
    const chooseType = (key) => {
        let type = findTypeByKey(selectedCat,key)
        setSelectedType(type)
    }


    const run_query = () => {
        let query = {
            and:[
                {
                    CATEGORY:selectedCat.ID,
                },
                {
                    TYPE:selectedType.key,
                },
            ]
        }
        predicates.forEach(p => {
            query.and.push(predicate_to_query(p))
        })
        let items = db.QUERY(query)
        set_debug_text(""
            +JSON.stringify(query,null,'  ')
            +"\n"
            +JSON.stringify(items,null,'  '))
    }

    const add_predicate = () => {
        let pred = {
            id:'someid'+Math.floor(Math.random()*100000),
            prop:'none',
            cond:'equal',
            value:'',
        }
        setPredicates(predicates.concat([pred]))
    }
    const update_predicate = (p) => {
        setPredicates(predicates.map(pp=>{
            if(pp.id === p.id) {
                return p
            } else {
                return pp
            }
        }))
    }

    const remove_predicate = (p) => {
        setPredicates(predicates.filter(pp => pp.id !== p.id))
    }

    return <div className={'dialog'}>
        <CategoryTypeQueryView selectedCat={selectedCat} selectedType={selectedType} chooseCat={chooseCat} chooseType={chooseType}/>
        {
            predicates.map(p => <PropertyQueryView predicate={p} key={p.id} type={selectedType}
                                                   onChanged={update_predicate}
                                                   onRemove={remove_predicate}
            />)
        }
        <HBox><button onClick={add_predicate}>+</button></HBox>
        <HBox>
            <button onClick={run_query}>run</button>
        </HBox>

        <textarea value={debug_text} className={"debug"} disabled/>
    </div>
}

function CategoryTypeQueryView({selectedCat, selectedType, chooseCat, chooseType}) {
    const chooseo = (cat_key) => {
        let cat = fetch_categories().filter(c => c.ID === cat_key)[0]
        chooseCat(cat)
    }
    let cats = fetch_categories()
    let types = fetch_types_by_category(selectedCat)
    return <HBox className={'cattype-row'}>
        <label>WHERE </label>
        <label>category is</label>
        <select value={selectedCat.ID} onChange={e => chooseo(e.target.value)}>
            {cats.map((cat)=><option key={cat.ID} value={cat.ID}>{cat.TITLE?cat.TITLE:cat.ID}</option>)}
        </select>
        <label>and type is</label>
        <select value={selectedType.ID} onChange={e => chooseType(e.target.value)}>
            {types.map(type=><option key={type.key} value={type.key}>{type.title}</option>)}
        </select>
    </HBox>
}

const QUERY_TYPES = {
    'STRING':[
            'equal',
            'not equal',
            'substring',
            'not substring',
    ],
    'BOOLEAN':[
        'is'
    ],
    'ENUM':[
        'is'
    ],
    'TIMESTAMP':[
        'before',
        'after',
        'equal'
    ],
    UNKNOWN:[]
}

function IS_PROP_BEFORE(prop, value) {
    return {
        before: {
            prop:prop,
            value:value,
        }
    }
}

function IS_PROP_AFTER(prop, value) {
    return {
        after: {
            prop:prop,
            value:value,
        }
    }
}

const COND_TYPES = {
    'equal':{
        gen:(p) => IS_PROP_EQUAL(p.prop,p.value)
    },
    'not equal':{
        gen:(p) => IS_PROP_NOTEQUAL(p.prop,p.value)
    },
    'substring': {
        gen:(p) => IS_PROP_SUBSTRING(p.prop,p.value)
    },
    'not substring': {
        gen:(p) => IS_PROP_NOTSUBSTRING(p.prop,p.value)
    },
    'is': {
        gen:(p) => IS_PROP_EQUAL(p.prop,p.value)
    },
    'before': {
        gen:(p) => IS_PROP_BEFORE(p.prop,p.value)
    },
    'after': {
        gen:(p) => IS_PROP_AFTER(p.prop,p.value)
    }
}

function predicate_to_query(p) {
    if(COND_TYPES[p.cond]) return COND_TYPES[p.cond].gen(p)
    throw new Error("cant convert predicate")
}

function find_conditions_for_prop(prop) {
    if(QUERY_TYPES[prop.type]) return QUERY_TYPES[prop.type]
    return QUERY_TYPES.UNKNOWN
}

function PropertyQueryView ({type, predicate, onChanged, onRemove}) {
    let [selectedProp, setSelectedProp] = useState({})
    let [selectedCondition, setSelectedCondition] = useState("equal")
    let [conditions, setConditions] = useState(QUERY_TYPES.STRING)
    let [value, setValue] = useState("")
    let props = fetch_props_for_type(type)

    const updatePredicate = () => {
        predicate.cond = selectedCondition
        predicate.prop = selectedProp.key
        predicate.value = value
        if(selectedProp.type === 'TIMESTAMP') {
            predicate.value = parseISO(value)
        }
        predicate.type = selectedProp.type
        return predicate
    }

    const chooseProp = (key) => {
        let prop = findPropByKey(props,key)
        setSelectedProp(prop)
        setConditions(find_conditions_for_prop(prop))
        setSelectedCondition(find_conditions_for_prop(prop)[0])
        if(prop.hasOwnProperty('default')) setValue(prop.default)
    }

    useEffect(()=>{
        onChanged(updatePredicate())
    },[value,selectedProp,selectedCondition])

    let condField = ""
    if(selectedProp && selectedProp.type === 'STRING') {
        condField = <input type={"text"} value={value} onChange={(e) => setValue(e.target.value)}/>
    }
    if(selectedProp && selectedProp.type === 'BOOLEAN') {
        condField = <input type={"checkbox"} checked={value}
                           onChange={e => setValue(e.target.checked)}/>
    }
    if(selectedProp && selectedProp.type === 'ENUM') {
        condField = <select value={value} onChange={e => setValue(e.target.value)}>
            {selectedProp.values.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    }
    if(selectedProp && selectedProp.type === 'TIMESTAMP') {
        if(value instanceof Date) value = format(value,'yyyy-M-dd')
        condField = <input type={"date"} value={value} onChange={(e) => setValue(e.target.value)}/>
    }

    return <HBox className={'prop-row'}>
        <label>AND</label>
        <label>property</label>
        <select value={selectedProp.key}
                onChange={e => chooseProp(e.target.value)}>
            {props.map(prop => <option key={prop.key}>{prop.key}</option>)}
        </select>
        <select value={selectedCondition}
                onChange={e => setSelectedCondition(e.target.value)}>
            {conditions.map(cond => <option key={cond}>{cond}</option>)}
        </select>
        {condField}
        <Icon onClick={()=>onRemove(predicate)}>close</Icon>
    </HBox>
}