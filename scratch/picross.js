class Grid {
    constructor() {
        this.rows = []
        this.width = 0
        this.height = 0
    }
    load(str) {
        let lines = str.trim().split('\n')
        this.height = lines.length
        this.width = lines[0].length
        // console.log('set to size',this.width,'x',this.height)
        this.rows = []
        lines.map(line => {
            // console.log('converting line',line)
            let row = []
            for(let i=0; i<line.length; i++) {
                let ch = line[i]
                // console.log("ch",ch)
                if(ch === '.') {
                    row.push({
                        value:MARKS.EMPTY,
                        mark:MARKS.UNKNOWN,
                    })
                    continue
                }
                if(ch === 'x') {
                    row.push({
                        value:MARKS.FILLED,
                        mark:MARKS.UNKNOWN,
                    })
                    continue
                }
                throw new Error("invalid cell value",ch)
            }
            this.rows.push(row)
        })
        console.log("final rows",this.rows)
    }
    getWidth() {
        return this.width
    }
    getHeight() {
        return this.height
    }
    isFilled(x,y) {
        // console.log(this.rows,x,y)
        let cell = this.rows[y][x]
        // console.log('cell',cell)
        return cell.value === MARKS.FILLED
    }

    getMark(x, y) {
        return this.rows[y][x].mark
    }

    setMark(x,y, mark) {
        this.rows[y][x].mark = mark
    }
    reveal() {
        this.forEach((cell,x,y)=>{
            // console.log(cell)
            cell.mark = cell.value
        })
    }
    reset() {
        this.forEach((cell)=>{
            cell.mark = MARKS.UNKNOWN
        })
    }

    forEach(cb) {
        for(let j=0; j<this.rows.length; j++) {
            for(let i=0; i<this.rows[0].length; i++) {
                cb(this.rows[j][i],i,j)
            }
        }
    }

    isSolved() {
        let solved = true
        this.forEach(cell => {
            //if every marked filled really is filled
            //if every filled is marked filled
            //don't care about the others
            if(cell.mark === MARKS.FILLED && cell.value !== MARKS.FILLED) {
                // console.log("failure 1")
                solved = false
            }
            if(cell.value === MARKS.FILLED && cell.mark !== MARKS.FILLED) {
                // console.log("failure 2")
                solved = false
            }
        })
        return solved
    }
}

const COLORS = {
    BGCOLOR:'white',
    GRIDCOLOR:'black',
    FILLEDCOLOR:'red',
    EMPTYCOLOR:'green',
    UNKNOWNCOLOR:'hsl(0,0%,80%)'
}

const MARKS = {
    UNKNOWN:'UNKNOWN',
    FILLED:'FILLED',
    EMPTY:'EMPTY',
}

class View {
    constructor(canvas) {
        this.canvas = canvas
        this.canvas.addEventListener('click',(e)=>this.handle_click(e))
    }
    calcScale() {
        return 40
    }
    drawGridlines(ctx,insetX, insetY) {
        let sc = this.calcScale()
        ctx.fillStyle = COLORS.BGCOLOR
        ctx.fillRect(0,0,this.canvas.width,this.canvas.height)
        ctx.lineWidth = 1
        ctx.strokeStyle = COLORS.GRIDCOLOR
        ctx.beginPath()
        let gw = insetX+grid.getWidth()
        let gh = insetY+grid.getHeight()
        for(let i=0; i<gw+1; i++) {
            ctx.moveTo(i*sc,0)
            ctx.lineTo(i*sc,gh*sc)
        }
        for(let i=0; i<gh+1; i++) {
            ctx.moveTo(0,i*sc)
            ctx.lineTo(gw*sc,i*sc)
        }
        ctx.stroke()
    }
    drawGameboard(ctx,insetX,insetY) {
        let sc = this.calcScale()
        for(let i=0; i<grid.getWidth();i++) {
            for(let j=0; j<grid.getHeight(); j++) {
                let mk = grid.getMark(i,j)
                if(mk === MARKS.FILLED) ctx.fillStyle = COLORS.FILLEDCOLOR
                if(mk === MARKS.UNKNOWN) ctx.fillStyle = COLORS.UNKNOWNCOLOR
                if(mk === MARKS.EMPTY) ctx.fillStyle = COLORS.EMPTYCOLOR
                let x = ((i+insetX)*sc)+1
                let y = ((j+insetY)*sc)+1
                ctx.fillRect(x,y,sc-2,sc-2)
            }
        }
    }
    calcHClues() {
        let cls = []
        for(let col=0; col<grid.getWidth(); col++) {
            let clues = []
            let run = 0
            for(let row=0; row<grid.getHeight(); row++) {
                if(grid.isFilled(col,row)) {
                    run++
                } else {
                    clues.push(run)
                    run=0
                }
            }
            clues.push(run)
            clues = clues.filter(num => num > 0)
            cls.push(clues)
        }
        return cls
    }
    calcVClues() {
        let cls = []
        for(let row=0; row<grid.getHeight(); row++) {
            let clues = []
            let run = 0
            let inside = false
            for(let col=0; col<grid.getWidth(); col++) {
                // first time through
                if(col === 0 && grid.isFilled(col,row)) inside = true

                if(grid.isFilled(col,row)) {
                    if(inside) {

                    }
                    run++
                } else {
                    clues.push(run)
                    run=0
                }
            }
            clues.push(run)
            clues = clues.filter(num => num > 0)
            cls.push(clues)
        }
        return cls
    }
    redraw() {
        const max_len = (acc,cur)=>{
            if(cur.length > acc) return cur.length
            return acc
        }
        let ctx = $("#canvas").getContext('2d')
        let hclues = this.calcHClues()
        let vclues = this.calcVClues()
        let vmax = vclues.reduce(max_len,0)
        let hmax = hclues.reduce(max_len,0)
        console.log("vmax",hmax,vmax)
        this.drawGridlines(ctx,vmax,hmax) //done
        this.drawGameboard(ctx,vmax,hmax) // done
        this.drawClues(ctx,hclues, vclues,vmax,hmax)
    }

    handle_click(e) {
        let pt = this.canvasToGrid(e)
        if(pt.x < 0 || pt.y < 0) return
        let mk = grid.getMark(pt.x,pt.y)
        // console.log("mark",mk)
        if(mk === MARKS.FILLED) grid.setMark(pt.x,pt.y,MARKS.UNKNOWN)
        if(mk === MARKS.UNKNOWN) grid.setMark(pt.x,pt.y,MARKS.EMPTY)
        if(mk === MARKS.EMPTY) grid.setMark(pt.x,pt.y,MARKS.FILLED)
        if(grid.isSolved()) {
            console.log("you won!")
            $(".message-scrim").classList.remove('hide')
            $(".message-text").innerHTML = 'You did it!<br/> Merry Christmas Jesse!'
            // grid.reset()
        }
        this.redraw()
    }

    canvasToGrid(e) {
        let rect = e.target.getBoundingClientRect()
        let pt = {
            x:Math.floor((e.clientX-rect.x)/this.calcScale()),
            y:Math.floor((e.clientY-rect.y)/this.calcScale()),
        }
        pt.x -= 4
        pt.y -= 4
        return pt
    }

    drawClues(ctx, hclues, vclues, insetX, insetY) {
        let sc = this.calcScale()
        ctx.fillStyle = 'black'
        ctx.font = '15pt sans-serif'

        ctx.save()
        ctx.translate(insetX*sc,0)
        hclues.forEach((col,i)=>{
            col.forEach((clue,j )=>{
                ctx.fillText(""+clue,i*sc+sc*0.3,j*sc+sc*0.6)
            })
        })
        ctx.restore()

        ctx.save()
        ctx.translate(0,insetY*sc)
        vclues.forEach((row,j)=>{
            row.forEach((clue,i )=>{
                ctx.fillText(""+clue,i*sc+sc*0.3,j*sc+sc*0.6)
            })
        })
        ctx.restore()
    }
}


let grid = new Grid()
grid.load(`
.x.x.
xxxxx
xxxxx
.xxx.
..x..
`)

// grid.reveal()

const $ = (sel) => document.querySelector(sel)
const on = (el,type,cb) => el.addEventListener(type,cb)

let canvas = $("#canvas")
let view = new View(canvas)
view.redraw()

on($(".message-text"),'click',()=>{
     grid.reset()
    $(".message-scrim").classList.add('hide')
})