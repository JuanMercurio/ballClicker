var Circle = /** @class */ (function () {
    function Circle(context) {
        this.context = context;
        this.r = ballSize;
        this.x = Math.min(randomEntre(canvas.width, this.r), canvas.width - this.r);
        this.y = Math.min(randomEntre(canvas.height, this.r), canvas.height - this.r);
        this.color = new Color(0, 0, 0, 0.8); //new Color(47, 203, 231, 0.8)
        this.direccion = [randomEntre(-1, 1), randomEntre(-1, 1)];
        this.velocidad = velocidad;
    }
    Circle.prototype.draw = function () {
        this.x += this.direccion[0] * velocidad;
        this.y += this.direccion[1] * velocidad;
        this.context.fillStyle = this.color.toString();
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
        this.context.fill();
    };
    return Circle;
}());
;
function clearScreen() {
    context.fillStyle = "#181818";
    context.fillRect(0, 0, canvas.width, canvas.height);
}
var Color = /** @class */ (function () {
    function Color(r, g, b, o) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.o = o;
    }
    Color.prototype.dropOpacity = function (n) {
        this.o -= n;
    };
    Color.prototype.toString = function () {
        return "rgb(".concat(this.r.toString(), ",", this.g.toString(), ",", this.b.toString(), ",", this.o.toString(), ")");
    };
    Color.prototype.getOpacity = function () {
        return this.o;
    };
    Color.prototype.random = function () {
        this.r = randomEntre(0, 255);
        this.g = randomEntre(0, 255);
        this.b = randomEntre(0, 255);
    };
    return Color;
}());
function randomEntre(min, max) {
    return Math.random() * (max - min) + min;
}
function particlesCreate(x, y, color) {
    for (var i = 0; i < 10; i++) {
        var particle = new Circle(context);
        particle.x = x;
        particle.y = y;
        particle.color.random();
        // particle.r /= 2
        particle.velocidad = randomEntre(5, 7);
        //particle.color.dropOpacity(randomEntre(0.1, 0.9))
        particles.push(particle);
    }
}
function particleLive(p, i) {
    //p.color.dropOpacity(randomEntre(0.01, 0.01))
    p.color.dropOpacity(0.001);
    //p.r *= 0.95
    p.draw();
    if (p.color.getOpacity() < 0) {
        particles.splice(i, 1);
    }
    if (p.velocidad > 20) {
        p.velocidad *= 0.5;
    }
    else {
        p.velocidad++;
    }
}
function shoot(x, y) {
    for (var i = 0; i < vivos.length; i++) {
        if (Math.sqrt(Math.pow(x - vivos[i].x, 2) + Math.pow(y - vivos[i].y, 2)) < vivos[i].r) {
            // muertos.push(vivos[i])
            particlesCreate(x, y, vivos[i].color);
            vivos.splice(i, 1);
            vivos.push(new Circle(context));
            break;
        }
    }
}
function step(timestamp) {
    clearScreen();
    //    muertos.forEach(shrink)
    //   muertos = muertos.filter(isDying)
    particles.forEach(particleLive);
    vivos.forEach(live);
    window.requestAnimationFrame(step);
}
function shrink(circle) {
    circle.draw();
    circle.r = Math.max(0, circle.r -= 2);
}
function live(circle) {
    circle.draw();
}
function isDying(circle) {
    return circle.r != 0;
}
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
//let muertos = new Array();
var vivos = new Array();
var particles = new Array();
var particlesCount = 10;
var ballSize = (canvas.width + canvas.height) / 30;
var cantBolas = 3;
var velocidad = 1;
for (var i = 0; i < cantBolas; i++) {
    vivos.push(new Circle(context));
}
document.addEventListener("mousedown", function (event) {
    shoot(event.clientX, event.clientY);
});
window.requestAnimationFrame(step);
