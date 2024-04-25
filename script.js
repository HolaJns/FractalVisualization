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

var canvas = document.querySelector("canvas");
canvas.width = 800;
canvas.height = 800;
var ctx = canvas.getContext("2d");
const center_canvas_x = canvas.width/2;
const center_canvas_y = canvas.height/2;
var rect = canvas.getBoundingClientRect();


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

function buringShip(z, c) {
    if(!z instanceof Complex ||!c instanceof Complex) {
        throw "Parameters must be of type Complex";
    }
    return add(multiply(new Complex(Math.abs(z.getReal()), Math.abs(z.getImag())), new Complex(Math.abs(z.getReal()), Math.abs(z.getImag()))), c);
}

//function swapper
var func = f;
function switchFunc(mode) {
    if(mode !== "Mandelbrot" && mode !== "Burning Ship" && mode !== "Multibrot") {
        console.error("Error. Unsupported fractal title");
        return;
    }
    if(mode == "Mandelbrot") {
        func = f;
        document.getElementById("title").innerHTML = mode;
    }
    if(mode == "Burning Ship") {
        func = buringShip;
        document.getElementById("title").innerHTML = mode;
    }
    if(mode == "Multibrot") {
        func = g;
        document.getElementById("title").innerHTML = mode;
    }
    memory = {};
    draw();
}

// lines on canvas

//visualize coordinate on cursor behavior
var linesActive = false;
function toggleLines() {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    refreshVariables();
    if(!linesActive) {
        document.getElementById("toggleLines").style.backgroundColor = "rgb(150, 255, 0)";
        linesActive = true;
        canvas.addEventListener('mousemove', visualiseLines);
    }
    else {
        document.getElementById("toggleLines").style.backgroundColor = "lime";
        linesActive = false;
        canvas.removeEventListener("mousemove",visualiseLines);
        ctx.drawImage(memory[generateCacheKey()],0,0);
    }
}


function visualiseLines(e) {
    ctx.drawImage(memory[generateCacheKey()],0,0);
    rect = canvas.getBoundingClientRect();
    const x =  e.clientX - rect.left;
    const y =  e.clientY - rect.top;
    ctx.beginPath();
    var solution = new Complex(0,0);
    ctx.moveTo(Math.abs(solution.getReal()/per_iteration+center_canvas_x-center[0]/per_iteration),Math.abs(solution.getImag()/per_iteration+center_canvas_y-center[1]/per_iteration));
    for(var i = 0; i < 100; i++) {
        ctx.lineTo(Math.abs(solution.getReal()/per_iteration+center_canvas_x-center[0]/per_iteration),Math.abs(solution.getImag()/per_iteration+center_canvas_y-center[1]/per_iteration));
        solution = func(solution, new Complex(center[0]+(x-center_canvas_x)*per_iteration, center[1]+(y-center_canvas_y)*per_iteration));
    }
    ctx.strokeStyle = "red";
    ctx.lineWidth = "3";
    ctx.stroke();
}


// visualisation of fractal

var POV = [-2,2];
var center = [0,0];
var distance = POV[1]-POV[0];
var range = 500;
var pixels_dim = canvas.width;
var per_iteration = distance / pixels_dim;
var memory = {};


//used to refresh POV, distance and per_iteration
function refreshVariables(start=POV[0], end=POV[1]) {
    POV[0] = start;
    POV[1] = end;
    distance = POV[1]-POV[0];
    per_iteration = distance / pixels_dim;
}

//returns String of rgb-gradient in CSS format
const color_gradient = function(depth) {
    return "rgb("+(1*depth/range)%1 + "," + (255*depth/range*depth)%255 + "," + (1*depth/range)%1 + ")";
}


//main function drawing the Mandelbrot-Set
function draw() {
    if(generateCacheKey() in memory) {
        ctx.drawImage(memory[generateCacheKey()], 0, 0);
        document.getElementById("Real").value = center[0];
        document.getElementById("Imaginary").value = center[1];
        document.getElementById("zoom").value = distance;
        return;
    }
    
    for (var row = POV[0]; row <= POV[1]; row += per_iteration) {
        for (var column = POV[0]; column <= POV[1]; column += per_iteration) {
            var depth = 0;
            var solution = new Complex(0, 0);
            for (var iter = 0; iter < range; iter++) {
                if (solution.abs() >= 100) { break; }
                solution = func(solution, new Complex(center[0] + row, center[1] + column));
                depth++;
            }
            if(depth > 0*range) {
                ctx.fillStyle = color_gradient(depth);
                ctx.fillRect(center_canvas_x+row/per_iteration,center_canvas_y+column/per_iteration,1,1);
            }
            else ctx.fillStyle = "black";
            
        }
    }
    document.getElementById("Real").value = center[0];
    document.getElementById("Imaginary").value = center[1];
    document.getElementById("zoom").value = distance;
    var link = canvas.toDataURL();
    document.getElementById("link").value = link;
    var backup_image = new Image();
    backup_image.src = link;
    memory[generateCacheKey()] = backup_image;
}

//iterates to to "range"
function iterate(c, range) {
    var solution = new Complex(0,0);
    for(var i = 0; i < range; i++) {
        solution = func(solution, c);
    }
    return solution;
}

//zoom in and out
canvas.addEventListener("wheel", function(e) {
    refreshVariables(POV[0]*2**(e.deltaY/100),POV[1]*2**(e.deltaY/100));
    clear();
    draw();
});


//set center coordinates based on cursor position
canvas.addEventListener('mousedown', function(e) {
    if(e.shiftKey) {
        const x = e.clientX-rect.left;
        const y = e.clientY-rect.top;
        center[0] = (x-center_canvas_x)*per_iteration+center[0];
        center[1] = (y-center_canvas_y)*per_iteration+center[1];
        clear();
        draw();
    }
    else if(e.detail == 2) {
        if(e.button == 2) refreshVariables(POV[0]*2,POV[1]*2);
        else if(e.button == 0) refreshVariables(POV[0]*0.5,POV[1]*0.5);
        clear();
        draw();
    }
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

function generateCacheKey() {
    return String(distance) + ":" + String(center[0]) + ":" + String(center[1]);
}

function decodeKey(key) {
    return key.split(":");
} 

canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }

//slider functions - iteration input
var sliderUnit = document.getElementById("slider"); 
var outputUnit = document.getElementById("amtOutput");
var a = 500;
outputUnit.innerHTML = sliderUnit.value;
sliderUnit.oninput = function() {
    outputUnit.innerHTML = this.value;
    a = this.value;
}
function confirm() {
    if(a != range) {
        memory = {};
        range = a;
        restore();
    }
}

function sendCoordinates() {
    center = [parseFloat(document.getElementById("Real").value.replace(".",".")), parseFloat(document.getElementById("Imaginary").value.replace(".","."))];
    refreshVariables();
    draw();
}


//-------------------------------------------------//
draw();