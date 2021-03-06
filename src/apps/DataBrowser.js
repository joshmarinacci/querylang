import React, {useContext, useEffect, useState} from 'react'
import {DBContext, propAsString, useDBChanged} from '../db.js'
import {BOOLEAN, CATEGORIES, lookup_schema, lookup_types_for_category, STRING} from '../schema.js'
import {
    AND,
    IS_PROP_CONTAINS,
    IS_PROP_EQUAL,
    IS_PROP_NOTEQUAL,
    IS_PROP_NOTSUBSTRING,
    IS_PROP_SUBSTRING,
    IS_TYPE
} from '../query2.js'
import {HBox, InfoBar, Panel, ToggleButton, ToggleGroup, Toolbar, VBox} from '../ui/ui.js'
import "./DataBrowser.css"
import Icon from '@material-ui/core/Icon'
import {format, parseISO} from 'date-fns'
import {Grid3Layout} from '../ui/grid3layout.js'
import {DataList, StandardSourceItem} from '../ui/dataList.js'
import {DialogManagerContext} from '../ui/DialogManager.js'
import {DataTable} from '../ui/datatable.js'

export function DataBrowser({app}) {
    let db = useContext(DBContext)
    let dm = useContext(DialogManagerContext)
    useDBChanged(db, CATEGORIES.GENERAL.ID)
    let queries = db.QUERY(AND(
        IS_TYPE(CATEGORIES.GENERAL.SCHEMAS.QUERY.TYPE)
    ))

    const [q, set_q] = useState(null)


    const makeQuery = () => {
        dm.show(<QueryEditorDialog/>)
    }

    let data = []
    if(q) {
        console.log(q.props.query)
        data = db.QUERY(q.props.query)
    }
    console.log('data is',data)

    const modes = ['table','list','chart','raw']
    const [mode, set_mode] = useState('raw')

    return <Grid3Layout statusbar={false}>
        <InfoBar title={'Data Browser'}/>
        <Toolbar className={'col2 span3'}>
            <button onClick={makeQuery}>make query</button>
            <input type={'search'}/>
            <ToggleViewsGroup values={modes} setValue={set_mode} selectedValue={mode}/>
        </Toolbar>
        <DataList col={1} row={2} data={queries} selected={q} setSelected={set_q}
                  renderItem={({item,...rest})=><StandardSourceItem
            title={propAsString(item,'title')}
            icon={propAsString(item,'icon')}
            {...rest}/>}/>
            <DataViewPanel data={data} mode={mode}/>
    </Grid3Layout>
}

function ToggleViewsGroup({values, setValue, selectedValue}) {
    return <ToggleGroup>
        {values.map(v => {
        return <ToggleButton caption={v} key={v} selected={v===selectedValue} onClick={()=>setValue(v)}/>
    })}
    </ToggleGroup>
}

function DataViewPanel({data, mode}) {
    const [sel, set_sel] = useState(null)
    if(mode === 'table') {
        return <VBox scroll className={'col2 span3'}>
            <DataTable data={data} selected={sel} setSelected={set_sel}
                       stringifyDataColumn={(item,key)=>{
                           let sch = lookup_schema('local',item.category, item.type)
                           if(!sch.props[key]) return "?"
                           let v = item.props[key]
                           if(sch.props[key].type === BOOLEAN) {
                               return v?"true":"false"
                           }
                           if(!v) return "---"
                           if(Array.isArray(v)) return "[...]"
                           return propAsString(item,key)
                       }}
            />
        </VBox>
    }
    if(mode === 'list') {
        return <VBox scroll className={'col2 span3'}>
            <DataList data={data} selected={sel} setSelected={set_sel} renderItem={({item,...rest}) => {
                let sch = lookup_schema('local',item.category, item.type)
                let str = ""
                Object.keys(sch.props).forEach(key =>{
                    if(sch.props[key].type === STRING) {
                        str += propAsString(item,key) + " "
                    }
                })
                return <StandardSourceItem title={sch.title} subtitle={str} {...rest}/>
            }}/>
        </VBox>
    }
    if(mode === 'chart') {
        return <VBox scroll className={'col2 span3'}>
            <div>no chart yet</div>
        </VBox>
    }
    return <Panel className={'col2 row2 span3 scroll'}>
        <div style={{
            whiteSpace:'pre',
            overflow:'auto',
        }}>
            {JSON.stringify(data,null,'  ')}
        </div>
    </Panel>
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
    let arr = lookup_types_for_category('local',cat.ID)
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
    let dm = useContext(DialogManagerContext)

    let [selectedCat, setSelectedCat] = useState({})
    let [selectedType, setSelectedType] = useState({})
    // let [propQuery, setPropQuery] = useState({})
    let [predicates, setPredicates] = useState([])
    let [debug_text, set_debug_text] = useState("")
    let [query_title, set_query_title] = useState("untitled")

    const chooseCat = (cat) => {
        setSelectedCat(cat)
    }
    const chooseType = (key) => {
        let type = findTypeByKey(selectedCat,key)
        setSelectedType(type)
    }


    const gen_query = () => {
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
        return query
    }
    const run_query = () => {
        let query = gen_query()
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

    useEffect(()=>{
        let query = gen_query()
        set_debug_text(""
            +JSON.stringify(query,null,'  '))
    },[selectedCat, selectedType, predicates])

    const remove_predicate = (p) => {
        setPredicates(predicates.filter(pp => pp.id !== p.id))
    }

    const save_query = () => {
        let query = gen_query()
        console.log('saving a query',query)
        let q = db.make(CATEGORIES.GENERAL.ID, CATEGORIES.GENERAL.SCHEMAS.QUERY.TYPE)
        db.setProp(q,'query',query)
        db.setProp(q,'title',query_title)
        db.add(q)
        dm.hide()
    }

    return <div className={'dialog'} style={{
        minHeight:'40em',
        display:'flex',
        flexDirection:'column',
        // zIndex:200,
    }}>
        <h1>Create Query</h1>
        <CategoryTypeQueryView selectedCat={selectedCat} selectedType={selectedType} chooseCat={chooseCat} chooseType={chooseType}/>
        {
            predicates.map(p => <PropertyQueryView predicate={p} key={p.id} type={selectedType}
                                                   onChanged={update_predicate}
                                                   onRemove={remove_predicate}
            />)
        }
        <HBox><button onClick={add_predicate}>+</button></HBox>
        <Toolbar>
            <button onClick={run_query}>run</button>
            <button onClick={save_query}>save</button>
            <input type={'text'} value={query_title} onChange={e => set_query_title(e.target.value)}/>
        </Toolbar>
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
    'ARRAY':[
        'contains',
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
    },
    'contains':{
        gen:(p) => IS_PROP_CONTAINS(p.prop, p.value)
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
    if(selectedProp && selectedProp.type === 'ARRAY') {
        condField = <input type={"text"} value={value} onChange={(e) => setValue(e.target.value)}/>
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