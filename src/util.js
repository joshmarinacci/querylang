// eslint-disable-next-line no-unused-vars
export function p(...args) {
    console.log(...args)
}
export const flatten = (obj) => {
    let str = ""
    Object.keys(obj).forEach(k => str += obj[k]?(k + " "):"")
    return str
}
