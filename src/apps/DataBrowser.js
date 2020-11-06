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

function findTypesForCategory(cat) {
    let tt = CATEGORIES[cat.ID].SCHEMAS
    if(!CATEGORIES[cat.ID].SCHEMAS) return [
        {
            key:'NONE',
            title:'none',
            props:{}
        }
    ]
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
    let arr = Object.values(type.props)
    arr.unshift({key:"NONE"})
    return arr
}

function findPropByKey(props, key) {
    console.log(props)
    return props.find(p => p.key === key)
    // return props[0]
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
    let cats = fetch_categories()
    let [types, setTypes] = useState([])
    let [props, setProps] = useState([])

    let [selectedCat, setSelectedCat] = useState({})
    let [selectedType, setSelectedType] = useState({})
    let [selectedProp, setSelectedProp] = useState({})
    let [selectedCondition, setSelectedCondition] = useState("equal")
    let [isTypeError, setIsTypeError] = useState(false)
    let [conditions, setConditions] = useState([
        "equal",
        "not equal",
        "substring",
    ])
    let [value, setValue] = useState("")
    let [debug_text, set_debug_text] = useState("")

    const chooseCat = (cat_key) => {
        let cat = fetch_categories().filter(c => c.ID === cat_key)[0]
        setSelectedCat(cat)
        if(!CATEGORIES[cat.ID]) {
            setTypes([])
            return
        }
        setTypes(findTypesForCategory(cat))
    }
    const chooseType = (key) => {
        let type = findTypeByKey(selectedCat,key)
        setSelectedType(type)
        if(!type) {
            console.warn(`missing schema for ${selectedCat}:${selectedType}`)
            setIsTypeError(true)
            setProps([])
        } else {
            setIsTypeError(false)
            setProps(fetch_props_for_type(type))
        }
    }

    const chooseProp = (key) => {
        let prop = findPropByKey(props,key)
        setSelectedProp(prop)
        console.log('chose prop',prop)
        setConditions(find_conditions_for_prop(prop))
        if(prop.hasOwnProperty('default')) {
            setValue(prop.default)
        }
    }

    const chooseCondition = (cond)=>{
        setSelectedCondition(cond)
    }
    console.log("=========")
    console.log("selected cat",selectedCat)
    console.log("selected type", selectedType)
    console.log("selected prop", selectedProp)
    console.log("selected prop", selectedCondition)
    console.log("value is",value)

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
        if(selectedCondition === 'equal') {
            query.and.push(IS_PROP_EQUAL(selectedProp.key,value))
        }
        if(selectedCondition === 'substring') {
            query.and.push(IS_PROP_SUBSTRING(selectedProp.key,value))
        }
        if(selectedCondition === 'is') {
            query.and.push(IS_PROP_EQUAL(selectedProp.key,value))
        }
        console.log("selected prop is",selectedProp)
        console.log("running query",query)
        let items = db.QUERY(query)
        console.log("returend items",items)
        set_debug_text(""
            +JSON.stringify(query,null,'  ')
            +"\n"
            +JSON.stringify(items,null,'  '))
    }

    let condField = ""
    if(selectedProp && selectedProp.type === 'STRING') {
        condField = <input type={"text"} value={value} onChange={(e) => setValue(e.target.value)}/>
    }
    if(selectedProp && selectedProp.type === 'BOOLEAN') {
        condField = <input type={"checkbox"} checked={value}
                           onChange={e => setValue(e.target.checked)}/>

    }


    return <div className={'dialog'}>
        <HBox>
            <label>category</label>
            <select value={selectedCat.ID} onChange={e => chooseCat(e.target.value)}>
                {cats.map((cat)=><option key={cat.ID} value={cat.ID}>{cat.ID}</option>)}
            </select>
        </HBox>
        <HBox>
            <label>type</label>
            <select value={selectedType.ID} onChange={e => chooseType(e.target.value)}>
                {types.map(type=><option key={type.key} value={type.key}>{type.title}</option>)}
            </select>
            <Icon className={isTypeError}>{isTypeError?"error":"check_circle"}</Icon>
        </HBox>

        <HBox>
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

        <HBox>
            <button onClick={run_query}>run</button>
        </HBox>

        <textarea value={debug_text} className={"debug"}></textarea>
    </div>
}