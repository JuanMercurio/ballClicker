class Circle {
    context;
    r: number;
    x: number;
    y: number;
    color: Color;
    direccion: [number, number];
    velocidad: number;

    constructor(context){
        this.context = context
        this.r = TARGET_SIZE
        this.x =  Math.min(randomEntre(canvas.width, this.r), canvas.width - this.r)
        this.y =  Math.min(randomEntre(canvas.height, this.r), canvas.height - this.r)
        this.color = new Color(255, 255, 255, 0.8) //new Color(47, 203, 231, 0.8)
        this.direccion = [randomEntre(-1, 1), randomEntre(-1, 1)]
        this.velocidad = TARGET_VELOCITY
    }

    draw () {
        this.x += this.direccion[0] * this.velocidad
        this.y += this.direccion[1] * this.velocidad
        this.context.fillStyle = this.color.toString();
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.context.fill();
    }
};


function clearScreen (context) {
    context.fillStyle = "#181818";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

class Color {
    r: number
    g: number
    b: number
    o: number

    constructor(r: number, g:number, b:number, o:number) {
        this.r = r
        this.g = g
        this.b = b
        this.o = o
    }

    dropOpacity(n: number) {
        this.o -= n
    }
    
    toString() {
        return "rgb(".concat(this.r.toString(), ",", this.g.toString(), ",", this.b.toString(), ",", this.o.toString(), ")")
    }

    getOpacity() {
        return this.o;
    }

    random() {
        this.r = randomEntre(0, 255)
        this.g = randomEntre(0, 255)
        this.b = randomEntre(0, 255)
    }
}

function randomEntre(min:number, max:number) {
    return Math.random() * (max - min) + min
}

function particlesCreate(x: number, y:number, color: Color) {
    for (let i=0; i<Math.min(streak, 30); i++) {
        let particle = new Circle(CONTEXT)
        particle.x = x
        particle.y = y
        particle.color.random()
        particle.r = 7 
        particle.velocidad = randomEntre(2, 3)
        particles.push(particle);
    }

}

function specialLive(s: Circle, i:number) {
    s.draw();
    s.color.dropOpacity(0.01)
}


function drawParticle( p: Circle, i:number) {
    p.draw();
    if (p.color.getOpacity() < 0) {
        particles.splice(i, 1)
    }

    p.color.dropOpacity((1/(p.r+1)) * 0.01)
    p.r *= 0.96
}

function festejo(x:number, y:number) {
    for (let i=0; i<50; i++) {
        let particula = new Circle(CONTEXT)
        particula.color = new Color(255,215,0,1)
        particula.x = x
        particula.y = y
        particula.r = 5
        particula.velocidad = randomEntre(10,15)
        particles.push(particula)
    }

}

function shoot(x, y) {

    for (let i=0; i<vivos.length; i++) {
        let root = Math.sqrt(Math.pow(x - vivos[i].x , 2) + Math.pow(y - vivos[i].y, 2))
        if ( root <= vivos[i].r) {

            streak += 1
            shootWindow = SHOOT_WINDOW

            if (streak === 27) {
                festejo(vivos[i].x, vivos[i].y)
            } else {
                particlesCreate(x,y, vivos[i].color)
            }

            vivos.splice(i, 1)
            vivos.push(new Circle(CONTEXT))
            return 
        }
    }

    streak = 0
}

function isPlayerTooSlow() {
    shootWindow -= 1
    if (shootWindow < 0) {
        streak = 0
    }
}

function frame() {
    clearScreen(CONTEXT);

    particles.forEach(drawParticle)
    vivos.forEach(drawTarget)

    isPlayerTooSlow()
    
    window.requestAnimationFrame(frame);
}

function drawTarget(target: Circle) {
    if (Math.floor(target.x - target.r) < 0 || Math.floor(target.x + target.r)  > canvas.width) {
        target.direccion[0] = target.direccion[0]*-1
    }
    
    if (Math.floor(target.y - target.r) < 0 || Math.floor(target.y + target.r)  > canvas.height) {
        target.direccion[1] = target.direccion[1]*-1
    }

    target.draw()
}

function isDying(circle) {
    return circle.r > 0
}


function initBalls() {
    for (let i=0; i<TARGET_COUNT; i++) {
        vivos.push(new Circle(CONTEXT))
    }
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement
const CONTEXT = canvas.getContext('2d')

canvas.height = window.innerHeight
canvas.width = window.innerWidth

const TARGET_SIZE = (canvas.width + canvas.height) / 30
const TARGET_COUNT = 3
const TARGET_VELOCITY = 2
const SHOOT_WINDOW = 50

let vivos = []
let specials = []
let particles = []
let particlesCount = 20
let streak = 0
let shootWindow = SHOOT_WINDOW

initBalls()

document.addEventListener("pointerdown", function(event) {
    shoot(event.clientX, event.clientY)
});

window.requestAnimationFrame(frame)


