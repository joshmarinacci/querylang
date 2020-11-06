import React, {useContext, useEffect, useRef, useState} from 'react'
import {DBContext, useDBChanged} from '../db.js'
import {CATEGORIES} from '../schema.js'
import {Window} from '../ui/window.js'
import {AND, IS_CATEGORY, IS_PROP_SUBSTRING, IS_TYPE} from '../query2.js'
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


function QueryEditorDialog() {
    let db = useContext(DBContext)
    let cats = Object.keys(CATEGORIES)
    cats.unshift("")
    let [types, setTypes] = useState([])
    let [props, setProps] = useState([])

    let [selectedCat, setSelectedCat] = useState("")
    let [selectedType, setSelectedType] = useState("")
    let [selectedProp, setSelectedProp] = useState("")
    let [selectedCondition, setSelectedCondition] = useState("equal")
    let [isTypeError, setIsTypeError] = useState(false)
    let [conditions, setConditions] = useState([
        "equal",
        "not equal",
        "substring",
    ])
    let [value, setValue] = useState("")

    const chooseCat = (cat) => {
        setSelectedCat(cat)
        let tt = CATEGORIES[cat].TYPES
        let arr = Object.keys(tt)
        arr.unshift("")
        setTypes(arr)
    }
    const chooseType = (type) => {
        setSelectedType(type)
        let sch = CATEGORIES[selectedCat].SCHEMAS[type]
        console.log("sch = ",sch)
        if(!sch) {
            console.warn(`missing schema for ${selectedCat}:${selectedType}`)
            setIsTypeError(true)
            setProps([])
            return
        } else {
            setIsTypeError(false)
            let arr = Object.values(sch.props)
            arr.unshift("")
            setProps(arr)
        }
    }

    const chooseProp = (prop) => {
        setSelectedProp(prop)
    }

    const chooseCondition = (cond)=>{
        setSelectedCondition(cond)
    }

    const run_query = () => {
        let query = {
            and:[
                {
                    CATEGORY:selectedCat,
                },
                {
                    TYPE:selectedType,
                },
            ]
        }
        if(selectedCondition === 'equal') {
            query.and.push({
                equal:{prop:selectedProp,value:value}
            })
        }
        if(selectedCondition === 'substring') {
            query.and.push(IS_PROP_SUBSTRING(selectedProp,value))
        }
        console.log("selected prop is",selectedProp)
        console.log("running query",query)
        let items = db.QUERY(query)
        console.log("returend items",items)
    }

    return <div className={'dialog'}>
        <HBox>
            <label>category</label>
            <select value={selectedCat} onChange={e => chooseCat(e.target.value)}>{cats.map((cat)=><option key={cat}>{cat}</option>)}</select>
        </HBox>
        <HBox>
            <label>type</label>
            <select value={selectedType} onChange={e => chooseType(e.target.value)}>{types.map((type)=><option key={type}>{type}</option>)}</select>
            <Icon className={isTypeError}>{isTypeError?"error":"check_circle"}</Icon>
        </HBox>

        <HBox>
            <label>property</label>
            <select value={selectedProp} onChange={e => chooseProp(e.target.value)}>{props.map(prop => <option key={prop.key}>{prop.key}</option>)}</select>
            <select value={selectedCondition} onChange={e => chooseCondition(e.target.value)}>
                {conditions.map(cond => <option key={cond}>{cond}</option>)}
            </select>
            <input type={"text"} value={value} onChange={(e)=>setValue(e.target.value)}/>
        </HBox>

        <HBox>
            <button onClick={run_query}>run</button>
        </HBox>
    </div>
}