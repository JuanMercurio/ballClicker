class Circle {
    constructor(context){
        this.context = context
        this.r = canvas.height/13
        this.x =  Math.min(Math.random() * (canvas.width) + this.r*3, canvas.width - this.r*3);
        this.y =  Math.min(Math.random() * (canvas.height) + this.r*3, canvas.height - this.r*3);
        this.color = "#2FCBE7"
        this.direccion = [Math.random()*(1 - (-1)) + (-1), Math.random()*(1 - (-1)) + (-1)]
    }

    draw () {
        this.x += this.direccion[0]
        this.y += this.direccion[1]
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
    for (i=0; i<vivos.length; i++) {
        if (Math.sqrt(Math.pow(x - vivos[i].x , 2) + Math.pow(y - vivos[i].y, 2)) < vivos[i].r) {
            muertos.push(vivos[i])
            vivos.splice(i, 1)
            vivos.push(new Circle(context))
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

var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

muertos = new Array();
vivos = new Array();
cantBolas = 3;

for (i=0; i<cantBolas; i++) {
    vivos.push(new Circle(context))
}

document.addEventListener("touchstart mousedown", function(event) {
    shoot(event.clientX, event.clientY)
});

window.requestAnimationFrame(step)


