
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

function switchFunc(mode) {
    if(mode !== "Mandelbrot" && mode !== "Burning Ship" && mode !== "Multibrot") {
        console.error("Error. Unsupported fractal title");
        return;
    }
    if(mode == "Mandelbrot") {
        func = f;
    }
    if(mode == "Burning Ship") {
        func = buringShip;
    }
    if(mode == "Multibrot") {
        func = g;
    }
    memory = {};
}

function color_gradient(depth) {
    if (depth >= range) {
        return "black";
    }
    let hue = (depth / range) * 360;
    let saturation = 100;
    let lightness = 50;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

var range, canvas, split, POV, per_iteration, center, center_canvas_x, center_canvas_y, func, ctx;

self.onmessage = function(message) {
    switchFunc(message.data[7]);
    split = message.data[0];
    POV = message.data[1];
    per_iteration = message.data[2];
    center_canvas_x = message.data[3];
    center_canvas_y = message.data[4];
    center = message.data[5];
    range = message.data[6];
    canvas = new OffscreenCanvas(800,800);
    ctx = canvas.getContext("2d");
    canvas.transferControlToOffscreen;
    for (var row = POV[0]/4*split; row <= POV[1]/4*split; row += per_iteration) {
        for (var column = POV[0]/4*split; column <= POV[1]/4*split; column += per_iteration) {
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
    var img = canvas.transferToImageBitmap();
    self.postMessage([img, split])
}

