import React, {useContext, useEffect, useRef, useState} from 'react'
import {DBContext, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {Window} from '../ui/window.js'
import {AND, IS_CATEGORY, IS_PROP_EQUAL, IS_PROP_SUBSTRING, IS_TYPE} from '../query2.js'
import {DataList, HBox, Panel, StandardListItem, Toolbar, VBox} from '../ui/ui.js'
import "./DataBrowser.css"
import Icon from '@material-ui/core/Icon'
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

function fetch_categories() {
    return [{ID:'NONE'}].concat(Object.values(CATEGORIES))
}

function findTypeByKey(selectedCat, key) {
    return CATEGORIES[selectedCat.ID].SCHEMAS[key]
}

function fetch_types_by_category(cat) {
    if(!cat || !CATEGORIES[cat.ID] || !CATEGORIES[cat.ID].SCHEMAS) return [
        {
            key:'NONE',
            title:'none',
            props:{}
        }
    ]
    let tt = CATEGORIES[cat.ID].SCHEMAS
    let arr = Object.keys(tt).map(key => {
        tt[key].key = key
        return tt[key]
    })
    arr.unshift({
        key:'NONE',
        title:'none',
        props:{}
    })
    return arr
}

function fetch_props_for_type(type) {
    if(!type || !type.props) return []
    let arr = Object.values(type.props)
    arr.unshift({key:"NONE"})
    return arr
}

function findPropByKey(props, key) {
    console.log(props)
    return props.find(p => p.key === key)
}

function find_conditions_for_prop(prop) {
    console.log('finding conditions for',prop)
    if(prop.type === 'STRING') {
        return [
            "equal",
            "not equal",
            "substring contains"
        ]
    }
    if(prop.type === 'BOOLEAN') {
        return [
            "is"
        ]
    }
    return ["unknown"]
}

function QueryEditorDialog() {
    let db = useContext(DBContext)

    let [selectedCat, setSelectedCat] = useState({})
    let [selectedType, setSelectedType] = useState({})
    let [propQuery, setPropQuery] = useState({})
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
        query.and.push(propQuery)
        let items = db.QUERY(query)
        set_debug_text(""
            +JSON.stringify(query,null,'  ')
            +"\n"
            +JSON.stringify(items,null,'  '))
    }

    return <div className={'dialog'}>
        <CategoryQueryView selectedCat={selectedCat} choose={chooseCat}/>
        <TypeQueryView selectedCat={selectedCat} selectedType={selectedType} choose={chooseType}/>
        <PropertyQueryView type={selectedType} onChanged={setPropQuery}/>
        <HBox><button>+</button></HBox>
        <HBox>
            <button onClick={run_query}>run</button>
        </HBox>

        <textarea value={debug_text} className={"debug"} disabled/>
    </div>
}

function CategoryQueryView({selectedCat, choose}) {
    const chooseCat = (cat_key) => {
        let cat = fetch_categories().filter(c => c.ID === cat_key)[0]
        choose(cat)
    }
    let cats = fetch_categories()
    return <HBox>
        <label>category</label>
        <select value={selectedCat.ID} onChange={e => chooseCat(e.target.value)}>
            {cats.map((cat)=><option key={cat.ID} value={cat.ID}>{cat.ID}</option>)}
        </select>
    </HBox>
}

function TypeQueryView({selectedCat, selectedType, choose}) {
    let types = fetch_types_by_category(selectedCat)
    return <HBox>
        <label>type</label>
        <select value={selectedType.ID} onChange={e => choose(e.target.value)}>
            {types.map(type=><option key={type.key} value={type.key}>{type.title}</option>)}
        </select>
    </HBox>
}

function PropertyQueryView ({type, onChanged}) {
    let [selectedProp, setSelectedProp] = useState({})
    let [selectedCondition, setSelectedCondition] = useState("equal")
    let [conditions, setConditions] = useState([
        "equal",
        "not equal",
        "substring",
    ])
    let [value, setValue] = useState("")
    let props = fetch_props_for_type(type)

    const genQuery = () => {
        if(selectedCondition === 'equal') {
            return IS_PROP_EQUAL(selectedProp.key,value)
        }
        if(selectedCondition === 'substring') {
            return IS_PROP_SUBSTRING(selectedProp.key,value)
        }
        if(selectedCondition === 'is') {
            return IS_PROP_EQUAL(selectedProp.key,value)
        }
        return {}
    }

    const chooseProp = (key) => {
        let prop = findPropByKey(props,key)
        setSelectedProp(prop)
        setConditions(find_conditions_for_prop(prop))
        if(prop.hasOwnProperty('default')) setValue(prop.default)
    }

    const chooseCondition = (cond)=>{
        setSelectedCondition(cond)
    }

    const chooseValue = (val) => {
        setValue(val)
    }

    useEffect(()=>{
        onChanged(genQuery())
    },[value,selectedProp,selectedCondition])

    let condField = ""
    if(selectedProp && selectedProp.type === 'STRING') {
        condField = <input type={"text"} value={value} onChange={(e) => chooseValue(e.target.value)}/>
    }
    if(selectedProp && selectedProp.type === 'BOOLEAN') {
        condField = <input type={"checkbox"} checked={value}
                           onChange={e => chooseValue(e.target.checked)}/>
    }

    return <HBox>
        <label>property</label>
        <select value={selectedProp.key}
                onChange={e => chooseProp(e.target.value)}>
            {props.map(prop => <option key={prop.key}>{prop.key}</option>)}
        </select>
        <select value={selectedCondition}
                onChange={e => chooseCondition(e.target.value)}>
            {conditions.map(cond => <option key={cond}>{cond}</option>)}
        </select>
        {condField}
    </HBox>
}