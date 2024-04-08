class complex {
    
    constructor(r, i) {
        if(r==null || i==null) {
            throw "Parameters must be of type Integer";
        }
        this.real = r;
        this.imag = i;
    }

    getReal() {
        return this.real;
    }

    getImag() {
        return this.imag;
    }

    setReal(x) {
        if(typeof x != "number") {
            throw "Parameter must be of type Integer";
        }
        this.real = x;
    }

    setImag(x) {
        if(typeof x != "number") {
            throw "Parameter must be of type Integer";
        }
        this.imag = x;
    }

    toString() {
        return this.real + "+" + this.imag + "i";
    }

    is_finite() {
        return (!isNaN(this.real) && !isNaN(this.imag && this.real != Infinity && this.imag != Infinity));
    }

    abs() {
        return Math.sqrt(this.real**2+this.imag**2);
    }

    sqrt() {
        return new complex(this.real*this.real-this.imag*this.imag, this.real*this.imag+this.imag*this.real);
    }
}

function add(a, b) {
    if(!b instanceof complex || !a instanceof complex) {
        throw "Parameters must be of type Complex";
    }
    return new complex(a.getReal()+b.getReal(), a.getImag()+b.getImag());
}

function multiply(a, b) {
    if(!b instanceof complex || !a instanceof complex) {
        throw "Parameters must be of type Complex";
    }
    return new complex(a.getReal()*b.getReal()-a.getImag()*b.getImag(), a.getReal()*b.getImag()+a.getImag()*b.getReal());
}


function f(z,c) {
    if(!z instanceof complex ||!c instanceof complex) {
        throw "Parameters must be of type Complex";
    }
    return add(multiply(z,z),c);
}



function julia_set(c,canvas) {
    let ctx = canvas.getContext("2d");
    clear();
    var solution = new complex(0,0);
    ctx.beginPath();
    ctx.moveTo(c.getReal()*250+500,c.getImag()*250+500);
    for(var i = 0; i < 100; i++) {
        ctx.lineTo(500+250*solution.getReal(), 500+250*solution.getImag());
        solution = f(solution, c);
    }
    ctx.strokeStyle = "red";
    ctx.lineWidth = "3";
    ctx.stroke();
}


// lines on canvas

const canvas = document.querySelector("canvas");
canvas.width = 1000;
canvas.height = 1000;
/*
canvas.addEventListener('mousemove', function(e) {
    const x = e.offsetX;
    const y = e.offsetY;
    var comp = new complex((x-500)/250,(y-500)/250);
    julia_set(comp, canvas);
});
*/




// interactive buttons

function sendAdd() {
    let r1 = parseFloat(document.getElementById("real1").value);
    let i1 = parseFloat(document.getElementById("imag1").value);
    let r2 = parseFloat(document.getElementById("real2").value);
    let i2 = parseFloat(document.getElementById("imag2").value);
    let a = new complex(r1, i1);
    let b = new complex(r2, i2);
    document.getElementById("output").value = add(a,b).toString();
}

function sendMul() {
    let r1 = parseFloat(document.getElementById("real1").value);
    let i1 = parseFloat(document.getElementById("imag1").value);
    let r2 = parseFloat(document.getElementById("real2").value);
    let i2 = parseFloat(document.getElementById("imag2").value);
    let a = new complex(r1, i1);
    let b = new complex(r2, i2);
    document.getElementById("output").value = multiply(a,b).toString();
}

function sendAbs() {
    let r1 = parseFloat(document.getElementById("real1").value);
    let i1 = parseFloat(document.getElementById("imag1").value);
    let a = new complex(r1, i1);
    document.getElementById("output").value = a.abs();
}

function sendSqrt() {
    let r1 = parseFloat(document.getElementById("real1").value);
    let i1 = parseFloat(document.getElementById("imag1").value);
    let a = new complex(r1, i1);
    document.getElementById("output").value = a.sqrt();
}

//coordinate-system

let cords_active = false;

function coordinate_system() {
    if(!cords_active) {
        let ctx = canvas.getContext("2d");
        ctx.strokeStyle = "lime";
        ctx.fillStyle = "lime";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width/2,0);
        ctx.lineTo(canvas.width/2,canvas.height);
        ctx.moveTo(0,canvas.height/2);
        ctx.lineTo(canvas.width,canvas.height/2);
        
        var ct = -(distance/2-1);
        for(var i = 1; i < distance; i++) {
            if(ct != 0) {
                ctx.fillText(ct, 0.5*i*canvas.width/(distance/2),canvas.height/2+20);
                ctx.fillText(-ct, canvas.width/2-20,0.5*i*canvas.height/(distance/2));
            }
            ct = ct + 1;
            ctx.moveTo(0.5*i*canvas.width/(distance/2),canvas.height/2-10);
            ctx.lineTo(0.5*i*canvas.width/(distance/2),canvas.height/2+10);
            ctx.moveTo(canvas.width/2-10,0.5*i*canvas.height/(distance/2));
            ctx.lineTo(canvas.width/2+10,0.5*i*canvas.height/(distance/2));
        }
        ctx.stroke();
        cords_active = true;
    }
    else {
        clear();
        draw();
        cords_active = false;
    }
}


// Mandelbrot

var POV = [-2,2];
var center = [0,0];
var distance = POV[1]-POV[0];
const range = 1000;
const ctx = canvas.getContext("2d");
var pixels_dim = canvas.width;
var per_iteration = distance / pixels_dim;


function refreshVariables(start=POV[0], end=POV[1]) {
    POV[0] = start;
    POV[1] = end;
    distance = POV[1]-POV[0];
    per_iteration = distance / pixels_dim;
    console.log("POV: " + POV + "\ndistance: " + distance + "\nper_iteration: " + per_iteration);
}

const color_gradient = function(depth) {
    return "rgb("+(-depth/range*255)%255 + "," + (depth/range*255)%255 + "," + (255-depth/range*255)%255 + ")";
}

function draw(centerX=center[0], centerY=center[1], start = POV[0], end = POV[1]) {
    
    for (var row = start; row <= end; row += per_iteration) {
        for (var column = start; column <= end; column += per_iteration) {
            var depth = 0;
            var solution = new complex(0, 0);
            for (var iter = 0; iter < range; iter++) {
                if (solution.abs() >= 1000) { break; }
                solution = f(solution, new complex(centerX + row, centerY + column));
                depth++;
            }
            if(depth > 0*range) {
                ctx.fillStyle = color_gradient(depth);
                ctx.fillRect(pixels_dim/2+row/per_iteration,pixels_dim/2+column/per_iteration,1,1);
            }
        }
    }
}

function iterate(c, range) {
    var solution = new complex(0,0);
    for(var i = 0; i < range; i++) {
        solution = f(solution, c);
    }
    return solution;
}


function generateRandomImage() {
    clear();
    var randComplex = new complex(NaN, NaN);
    var solution = false;
    var temporary_random_zoom = random();
    refreshVariables(-temporary_random_zoom,temporary_random_zoom);
    while(!solution) { 
        randComplex = new complex(-2+Math.random()*4,-2+Math.random()*4); 
        solution = iterate(randComplex, 25).is_finite();
    }
    var border_finite = 0;
    for(var i = -2; i <= 2; i++) {
        for(var j = -2; j <= 2; j++) {
            if(new complex(randComplex.getReal() + randComplex.getReal()*i*per_iteration, randComplex.getImag() + randComplex.getImag()*j*per_iteration).is_finite()) { border_finite++; }
        }
    }
    if(border_finite/25 < 0.3) { generateRandomImage(); }
    else {
        console.log(randComplex.toString());
        center = [randComplex.getReal(),randComplex.getImag()];
        draw();
    }
}

canvas.addEventListener("wheel", function(e) {
    if(e.deltaY < 0) { refreshVariables(POV[0]*0.5,POV[1]*0.5); }
    if(e.deltaY > 0) { refreshVariables(POV[0]*2,POV[1]*2); }
    console.log(e.deltaY);
    clear();
    console.log(center);
    draw();
});

canvas.addEventListener('mousedown', function(e) {
    var rect = canvas.getBoundingClientRect();
    const x = e.clientX-rect.left;
    const y = e.clientY-rect.top;
    center[0] = (x-pixels_dim/2)*per_iteration+center[0];
    center[1] = (y-pixels_dim/2)*per_iteration+center[1];
    clear();
    console.log(center);
    draw();
});

const random = function() {
    var zeros = Math.round(Math.random()*1/10*range);
    console.log(zeros);
    return Math.random()*2/10**zeros;
}


const clear = function() { ctx.clearRect(0,0,pixels_dim,pixels_dim); }

const restore = function() {
    center = [0,0];
    clear();
    refreshVariables(-2,2);
    draw();
}

draw();
//generateRandomImage();