import React, {useState} from 'react'

import {range} from '../util.js'
import faker from 'faker'
import {DataTable} from '../ui/datatable.js'
import {sort} from '../db.js'
import {SORTS} from '../schema.js'

// import "../theme.css"
import "../ui/datatable.css"

export default {
    title: 'QueryOS/Controls',
    component: DataTable,
    argTypes: {
    },
};

const gen_data =() => {
    let data = range(0,20,1).map((i)=>{
        return {
            id:i,
            props: {
                title:`some title ${i}`,
                company: faker.company.companyName(),
                date: faker.date.past().toString(),
                code:faker.hacker.abbreviation(),
                email: faker.internet.email(),
            }
        }
    })
    return data
}

export const PlainDataTable = () => {
    let [data] = useState(() => gen_data())
    return <DataTable data={data}/>
}

export const DataTableWithSelection = () => {
    const [s, ss] = useState(null)
    let [data] = useState(() => gen_data())
    return <DataTable data={data} selected={s} setSelected={ss}/>
}

export const SortableDataTable = () => {
    const [s, ss] = useState(null)
    let [data, setData] = useState(() => gen_data())
    let [sortField, setSortField] = useState(null)
    let [sortDir, setSortDir] = useState(SORTS.ASCENDING)

    return <DataTable data={data} selected={s} setSelected={ss} onSortChange={(a)=>{
        let sd = sortDir
        if(sortField === a) {
            if(sd === SORTS.ASCENDING) {
                sd = SORTS.DESCENDING
            }else {
                sd = SORTS.ASCENDING
            }
        }
        setSortDir(sd)
        setSortField(a)
        setData(sort(data,[a], sd))
    }
    } sortField={sortField} sortDirection={sortDir}/>
}


