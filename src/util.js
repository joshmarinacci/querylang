import {propAsArray} from './db.js'

export function p(...args) {
    console.log(...args)
}
export const flatten = (obj) => {
    let str = ""
    Object.keys(obj).forEach(k => str += obj[k]?(k + " "):"")
    return str
}

export function calculateFoldersFromTags(folders) {
    let tagset = new Set()
    folders.forEach(n => propAsArray(n,'tags').forEach(t => tagset.add(t)))
    return Array.from(tagset.values()).map((t,i)=>{
        return {
            id:3000+i,
            props: {
                title:t,
                icon:'label',
                query:true,
                tag:true,
            }
        }
    })
}


export const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
