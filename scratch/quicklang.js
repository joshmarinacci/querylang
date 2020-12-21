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
    if($("#auto-run").checked) {
        run(code)
    }
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
            //flip the y axis
            //shift down by half?
            // this.ctx.translate(250, 250)
            this.ctx.scale(1,-1)
            this.ctx.translate(250,-250)

            const drawDebug = () => {
                let c = this.ctx
                c.fillStyle = 'hsl(0,0%,90%)'
                c.fillRect(-250,-1,500,2)
                c.fillRect(-1,-250,2,500)
            }
            drawDebug()

            let t = {x: 0, y: 0}

            const drawCommands = () => {
                this.ctx.lineWidth = 5
                this.ctx.strokeStyle = 'red'
                this.ctx.beginPath()
                this.ctx.moveTo(t.x, t.y)
                this.commands.forEach(cmd => {
                    if (cmd.cmd === 'forward') {
                        let v = {x: 0, y: 0}
                        v.x = Math.sin(this.bearing) * cmd.arg
                        v.y = Math.cos(this.bearing) * cmd.arg
                        t.x += v.x
                        t.y += v.y
                        this.ctx.lineTo(t.x, t.y)
                    }
                    if (cmd.cmd === 'rotate') {
                        this.bearing += Math.PI / 180 * cmd.arg
                    }
                    // console.log("now at", t.x, t.y)
                })
                this.ctx.stroke()
            }
            drawCommands()

            const drawTurtle = () => {
                this.ctx.translate(t.x, t.y)
                this.ctx.fillStyle = 'green'
                this.ctx.rotate(2*(Math.PI/4)-this.bearing)
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
    clear() {
        this.redraw()
        this.bearing = 0
        this.commands = []
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

$$("#examples li a").forEach((a => {
    on(a,'click',(e)=>{
        e.preventDefault()
        let url = new URL(a.getAttribute('href'),window.location)
        $("#input").value = $(url.hash).innerText
    })
}))

new Turtle().clear()

on($("#manual-run"),'click',()=>{
    run($("#input").value)
})
on($("#clear-screen"),'click',() => {
    new Turtle().clear()
})