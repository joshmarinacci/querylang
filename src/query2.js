const isAnd = (opts) => opts.hasOwnProperty('and')

const isOr = (opts) => opts.hasOwnProperty('or')

function processEqual(equal, o) {
    if(!o) return false
    if(!o.props) return false
    if(!o.props.hasOwnProperty(equal.prop)) return false
    let ov = o.props[equal.prop]
    let fv = equal.value
    if(Array.isArray(ov)) {
        if (ov.length !== fv.length) return false
        for (let i = 0; i < ov.length; i++) {
            if (ov[i] !== fv[i]) return false
        }
        return true
    }
    if(o.props[equal.prop] !== equal.value) return false
    return true
}

function processSubstring(substring, o) {
    if(!o) return false
    if(!o.props) return false
    if(!o.props.hasOwnProperty(substring.prop)) return false
    if(!o.props[substring.prop].toLowerCase().includes(substring.value.toLowerCase())) return false
    return true
}

function passPredicate(pred,o) {
    if(pred.hasOwnProperty('TYPE') && o.type !== pred.TYPE) return false
    if(pred.hasOwnProperty('CATEGORY') && o.category !== pred.CATEGORY) return false
    if(isOr(pred) && !processOr(pred,o)) return false;
    if(isAnd(pred) && !processAnd(pred,o)) return false;
    if(pred.hasOwnProperty('equal') && !processEqual(pred.equal,o)) return false
    if(pred.hasOwnProperty('substring') && !processSubstring(pred.substring,o)) return false
    return true
}

function processAnd(opts, o) {
    let pass = true
    opts.and.forEach(pred =>{
        if(!pass) return //skip ones that have already failed
        if(!passPredicate(pred,o)) pass = false
    })
    return pass
}

function processOr(opts, o) {
    let pass = false
    opts.or.forEach(pred => {
        if(pass) return //skip if one already succeeded
        if(passPredicate(pred,o)) pass = true
    })
    return pass
}

export function query2(data,opts) {
    let res = []
    data.forEach(o => {
        if(isAnd(opts) && processAnd(opts,o)) res.push(o)
        if(isOr(opts) && processOr(opts,o)) res.push(o)
    })
    return res
}


export const AND = (...args) => ({ and: args})
export const OR = (...args) => ({ or: args})