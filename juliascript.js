class Complex {
    
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
        return new Complex(this.real*this.real-this.imag*this.imag, this.real*this.imag+this.imag*this.real);
    }
}

function add(a, b) {
    if(!b instanceof Complex || !a instanceof Complex) {
        throw "Parameters must be of type Complex";
    }
    return new Complex(a.getReal()+b.getReal(), a.getImag()+b.getImag());
}

function multiply(a, b) {
    if(!b instanceof Complex || !a instanceof Complex) {
        throw "Parameters must be of type Complex";
    }
    return new Complex(a.getReal()*b.getReal()-a.getImag()*b.getImag(), a.getReal()*b.getImag()+a.getImag()*b.getReal());
}


// interactive buttons used in complex.html

function sendAdd() {
    let r1 = parseFloat(document.getElementById("real1").value);
    let i1 = parseFloat(document.getElementById("imag1").value);
    let r2 = parseFloat(document.getElementById("real2").value);
    let i2 = parseFloat(document.getElementById("imag2").value);
    let a = new Complex(r1, i1);
    let b = new Complex(r2, i2);
    document.getElementById("output").value = add(a,b).toString();
}

function sendMul() {
    let r1 = parseFloat(document.getElementById("real1").value);
    let i1 = parseFloat(document.getElementById("imag1").value);
    let r2 = parseFloat(document.getElementById("real2").value);
    let i2 = parseFloat(document.getElementById("imag2").value);
    let a = new Complex(r1, i1);
    let b = new Complex(r2, i2);
    document.getElementById("output").value = multiply(a,b).toString();
}

function sendAbs() {
    let r1 = parseFloat(document.getElementById("real1").value);
    let i1 = parseFloat(document.getElementById("imag1").value);
    let a = new Complex(r1, i1);
    document.getElementById("output").value = a.abs();
}

function sendSqrt() {
    let r1 = parseFloat(document.getElementById("real1").value);
    let i1 = parseFloat(document.getElementById("imag1").value);
    let a = new Complex(r1, i1);
    document.getElementById("output").value = a.sqrt();
}


//-----------------------------------------------------------------------

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;


//default function z = z^2+c
function f(z,c) {
    if(!z instanceof Complex ||!c instanceof Complex) {
        throw "Parameters must be of type Complex";
    }
    return add(multiply(z,z),c);
}

function g(z, c) {
    if(!z instanceof Complex ||!c instanceof Complex) {
        throw "Parameters must be of type Complex";
    }
    return add(multiply(multiply(z,z),multiply(z,z)),c);
}


// lines on canvas

//draws iteration-lines based on complex input
function visualiseLines(c) {
    var solution = new Complex(0,0);
    ctx.beginPath();
    ctx.moveTo(c.getReal()*canvas.width/distance+canvas.width/2,c.getImag()*canvas.height/distance+canvas.height/2);
    for(var i = 0; i < 100; i++) {
        ctx.lineTo(canvas.width/2+canvas.width/distance*solution.getReal(), canvas.height/2+canvas.height/distance*solution.getImag());
        solution = f(solution, c);
    }
    ctx.strokeStyle = "red";
    ctx.lineWidth = "3";
    ctx.stroke();
}

/*
canvas.addEventListener('mousemove', function(e) {
    const x = e.clientX - e.offsetX;
    const y = e.clientY - e.offsetY;
    var comp = new Complex((x-canvas.width)/canvas.width/distance,(y-canvas.height)/canvas.height/distance);
    visualiseLines(comp);
});
*/



//coordinate-system

let cords_active = false;

function coordinate_system() {
    if(!cords_active) {
        let ctx = canvas.getContext("2d");
        ctx.strokeStyle = "lime";
        ctx.fillStyle = "lime";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(center[0]/per_iteration+canvas.width/2,0);
        ctx.lineTo(center[0]/per_iteration+canvas.width/2,canvas.height);
        ctx.moveTo(0,center[1]+canvas.height/2);
        ctx.lineTo(center[0]+canvas.width,center[1]+canvas.height/2);
        
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
const range = 200;
var pixels_dim = canvas.width;
var per_iteration = distance / pixels_dim;


//used to refresh POV, distance and per_iteration
function refreshVariables(start=POV[0], end=POV[1]) {
    POV[0] = start;
    POV[1] = end;
    distance = POV[1]-POV[0];
    per_iteration = distance / pixels_dim;
    console.log("POV: " + POV + "\ndistance: " + distance + "\nper_iteration: " + per_iteration);
}

//returns String of rgb-gradient in CSS format
const color_gradient = function(depth) {
    return "rgb("+(255/3*depth/range*255)%255 + "," + (2*255/3*depth/range*255)%255 + "," + (3*255/3*depth/range*255)%1 + ")";
}


//main function drawing the Mandelbrot-Set
function draw() {
    
    for (var row = POV[0]; row <= POV[1]; row += per_iteration) {
        for (var column = POV[0]; column <= POV[1]; column += per_iteration) {
            var depth = 0;
            var solution = new Complex(0, 0);
            for (var iter = 0; iter < range; iter++) {
                if (solution.abs() >= 1000) { break; }
                solution = f(solution, new Complex(center[0] + row, center[1] + column));
                depth++;
            }
            if(depth > 0*range) {
                ctx.fillStyle = color_gradient(depth);
                ctx.fillRect(pixels_dim/2+row/per_iteration,pixels_dim/2+column/per_iteration,1,1);
            }
        }
    }
    document.getElementById("Real").value = center[0];
    document.getElementById("Imaginary").value = center[1];
    document.getElementById("zoom").value = distance;
}

//iterates to to "range"
function iterate(c, range) {
    var solution = new Complex(0,0);
    for(var i = 0; i < range; i++) {
        solution = f(solution, c);
    }
    return solution;
}

//generates a random image - TODO
function generateRandomImage() {
    clear();
    var randComplex = new Complex(NaN, NaN);
    var solution = false;
    var temporary_random_zoom = random();
    console.log(temporary_random_zoom);
    refreshVariables(-temporary_random_zoom,temporary_random_zoom);
    while(!solution) { 
        randComplex = new Complex(-2+Math.random()*4,-2+Math.random()*4); 
        solution = iterate(randComplex, 25).is_finite();
    }
    var border_finite = 0;
    for(var i = -25; i <= 25; i++) {
        for(var j = -25; j <= 25; j++) {
            if(new Complex(randComplex.getReal() + i*per_iteration, randComplex.getImag() + j*per_iteration).is_finite()) { border_finite++; }
        }
    }
    if(border_finite/51**2 > 0.2) { generateRandomImage(); }
    else {
        console.log(randComplex.toString());
        center = [randComplex.getReal(),randComplex.getImag()];
        draw();
    }
}

//helping function - returns a random number with random numbers of zeroes
const random = function() {
    var zeros = Math.round(Math.random()*range*1/20);
    return Math.random()*2/(10**zeros);
}

//zoom in and out
canvas.addEventListener("wheel", function(e) {
    if(e.deltaY < 0) { refreshVariables(POV[0]*0.5,POV[1]*0.5); }
    if(e.deltaY > 0) { refreshVariables(POV[0]*2,POV[1]*2); }
    console.log(e.deltaY);
    clear();
    console.log(center);
    draw();
});

//set center coordinates based on cursor position
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



//short ctx.clear()
const clear = function() { ctx.clearRect(0,0,pixels_dim,pixels_dim); }

//restore default image (center[0,0] & POV[-2,2])
const restore = function() {
    center = [0,0];
    clear();
    refreshVariables(-2,2);
    draw();
}

//-------------------------------------------------//
draw();
//generateRandomImage();