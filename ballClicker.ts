class Circle {
    context;
    r: number;
    x: number;
    y: number;
    color: string;
    direccion: [number, number];
    velocidad: number;



    constructor(context){
        this.context = context
        this.r = ballSize
        this.x =  Math.min(Math.random() * (canvas.width) + this.r, canvas.width - this.r);
        this.y =  Math.min(Math.random() * (canvas.height) + this.r, canvas.height - this.r);
        this.color = "#2FCBE7"
        this.direccion = [Math.random()*(1 - (-1)) + (-1), Math.random()*(1 - (-1)) + (-1)]
        this.velocidad = velocidad
    }

    draw () {
        this.x += this.direccion[0] * velocidad
        this.y += this.direccion[1] * velocidad
        // esto es el borde
        // this.context.fillStyle = "#181818";
        // this.context.beginPath();
        // this.context.arc(this.x, this.y, this.r+2, 0, 2 * Math.PI);
        // this.context.fill();
        this.context.fillStyle = this.color;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.context.fill();
    }


};

function clearScreen () {
    context.fillStyle = "#181818";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function shoot(x, y) {
    for (let i=0; i<vivos.length; i++) {
        if (Math.sqrt(Math.pow(x - vivos[i].x , 2) + Math.pow(y - vivos[i].y, 2)) < vivos[i].r) {
            muertos.push(vivos[i])
            vivos.splice(i, 1)
            vivos.push(new Circle(context))
            break
        }
    }
}

function step(timestamp) {
    clearScreen();

    muertos.forEach(shrink)
    muertos = muertos.filter(isDying)
    vivos.forEach(live)
    
    window.requestAnimationFrame(step);
}

function shrink(circle) {
    circle.draw()
    circle.r = Math.max(0, circle.r -= 2) 
}

function live(circle) {
    circle.draw()
}

function isDying(circle) {
    return circle.r != 0
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let muertos = new Array();
let vivos = new Array();

const ballSize = (canvas.width + canvas.height) / 30;
const cantBolas = 3;
const velocidad = 1;

for (let i=0; i<cantBolas; i++) {
    vivos.push(new Circle(context))
}

document.addEventListener("mousedown", function(event) {
    shoot(event.clientX, event.clientY)
});

window.requestAnimationFrame(step)


