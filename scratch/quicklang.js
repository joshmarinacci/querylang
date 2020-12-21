console.log("loading quick lang")

const $  = (sel)=>document.querySelector(sel)
const $$ = (sel) => document.querySelectorAll(sel)
const on = (el,type,cb) => el.addEventListener(type,cb)


const log = (...args) => {
    $("#console").value += [...args,'\n'].join("")
    $("#console").scrollTop = $("#console").scrollHeight;
}

on($("#input"),'input',() => {
    let code = $("#input").value
    run(code)
})
log("loaded quick lang")


class Turtle {
    constructor() {
        this.canvas = $("#output")
        this.ctx = this.canvas.getContext('2d')
        this.x = 0
        this.y = 0
        this.bearing = -Math.PI/180*0
        this.commands = []
    }
    redraw() {
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(0,0,500,500)
        this.ctx.save()
        try {
            this.ctx.translate(250, 250)
            this.ctx.scale(0,-1)

            let t = {x: 0, y: 0}

            const drawStart = () => {
                this.ctx.fillStyle = 'yellow'
                this.ctx.fillRect(t.x,t.y,10,10)
            }
            drawStart()
            const drawCommands = () => {
                this.ctx.lineWidth = 5
                this.ctx.strokeStyle = 'red'
                this.ctx.beginPath()
                this.ctx.moveTo(t.x, t.y)
                this.commands.forEach(cmd => {
                    console.log("cmd", cmd)
                    if (cmd.cmd === 'forward') {
                        let v = {x: 0, y: 0}
                        v.x = Math.sin(this.bearing) * cmd.arg
                        v.y = Math.cos(this.bearing) * cmd.arg
                        t.x += v.x
                        t.y += v.y
                        this.ctx.lineTo(t.x, t.y)
                    }
                    if (cmd.cmd === 'rotate') {
                        this.bearing -= Math.PI / 180 * cmd.arg
                    }
                    console.log("now at", t.x, t.y)
                })
                this.ctx.stroke()
            }
            drawCommands()

            const drawTurtle = () => {
                this.ctx.translate(t.x, t.y)
                this.ctx.fillStyle = 'green'
                this.ctx.rotate(this.bearing-Math.PI*3/2)
                this.ctx.beginPath()
                this.ctx.lineTo(0, 10)
                this.ctx.lineTo(25, 0)
                this.ctx.lineTo(0, -10)
                this.ctx.closePath()
                this.ctx.fill()
            }
            drawTurtle()
        } catch (e) {
            console.log('error while drawing',e)
        }
        this.ctx.restore()
    }
    forward(len) {
        this.commands.push({cmd:"forward",arg:len})
        // this.redraw()
    }
    rotate(ang) {
        this.commands.push({cmd:'rotate', arg:-ang})
        // this.redraw()
    }
    done() {
        this.redraw()
    }

}

function run(code) {
    try {
        log("running")
        eval(code)
        log("done")
    } catch (e) {
        log("error",e)
    }
}