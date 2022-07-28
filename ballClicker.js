var Circle = /** @class */ (function () {
    function Circle(context) {
        this.context = context;
        this.r = ballSize;
        this.x = Math.min(randomEntre(canvas.width, this.r), canvas.width - this.r);
        this.y = Math.min(randomEntre(canvas.height, this.r), canvas.height - this.r);
        this.color = new Color(255, 255, 255, 0.8); //new Color(47, 203, 231, 0.8)
        this.direccion = [randomEntre(-1, 1), randomEntre(-1, 1)];
        this.velocidad = velocidad;
    }
    Circle.prototype.draw = function () {
        this.x += this.direccion[0] * this.velocidad;
        this.y += this.direccion[1] * this.velocidad;
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
    for (var i = 0; i < Math.min(streak, 30); i++) {
        var particle = new Circle(context);
        particle.x = x;
        particle.y = y;
        particle.color.random();
        particle.r = 7;
        particle.velocidad = randomEntre(2, 3);
        particles.push(particle);
    }
}
function specialLive(s, i) {
    s.draw();
    s.color.dropOpacity(0.01);
}
function particleLive(p, i) {
    p.draw();
    if (p.color.getOpacity() < 0) {
        particles.splice(i, 1);
    }
    p.color.dropOpacity((1 / (p.r + 1)) * 0.01);
    p.r *= 0.96;
}
function festejo(x, y) {
    for (var i = 0; i < 50; i++) {
        var particula = new Circle(context);
        particula.color = new Color(255, 215, 0, 1);
        particula.x = x;
        particula.y = y;
        particula.r = 5;
        particula.velocidad = randomEntre(10, 15);
        particles.push(particula);
    }
}
function shoot(x, y) {
    for (var i = 0; i < vivos.length; i++) {
        var root = Math.sqrt(Math.pow(x - vivos[i].x, 2) + Math.pow(y - vivos[i].y, 2));
        if (root <= vivos[i].r) {
            streak += 1;
            time = 50;
            console.log(streak);
            if (streak == 27) {
                festejo(vivos[i].x, vivos[i].y);
            }
            else {
                particlesCreate(x, y, vivos[i].color);
            }
            vivos.splice(i, 1);
            vivos.push(new Circle(context));
            return;
        }
    }
    // console.log("le pifiesta perro")
    streak = 0;
}
function step(timestamp) {
    clearScreen();
    particles.forEach(particleLive);
    // specials.forEach(specialLive)
    vivos.forEach(live);
    time -= 1;
    if (time < 0) {
        streak = 0;
    }
    window.requestAnimationFrame(step);
}
function shrink(circle) {
    circle.draw();
    circle.r = Math.max(0, circle.r -= 2);
}
function live(circle) {
    if (Math.floor(circle.x - circle.r) < 0 || Math.floor(circle.x + circle.r) > canvas.width) {
        circle.direccion[0] = circle.direccion[0] * -1;
    }
    if (Math.floor(circle.y - circle.r) < 0 || Math.floor(circle.y + circle.r) > canvas.height) {
        circle.direccion[1] = circle.direccion[1] * -1;
    }
    circle.draw();
}
function isDying(circle) {
    return circle.r > 0;
}
var canvas = document.getElementById("canvas");
var context = canvas.getContext('2d');
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var vivos = new Array();
var specials = new Array();
var particles = new Array();
var particlesCount = 20;
var streak = 0;
var time = 30;
var ballSize = (canvas.width + canvas.height) / 30;
var cantBolas = 3;
var velocidad = 2;
for (var i = 0; i < cantBolas; i++) {
    vivos.push(new Circle(context));
}
document.addEventListener("mousedown", function (event) {
    shoot(event.clientX, event.clientY);
});
window.requestAnimationFrame(step);
