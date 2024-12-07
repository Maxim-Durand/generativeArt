let x;
let y;
let z;
let all_attractors = [["LorenzSystem", LorenzSystem], ["RosslerSystem", RosslerSystem], ["LuChen", LuChen], ["ModifiedChua", ModifiedChua]]
let attractorMap = new Map(all_attractors)
let selected_attractor
let all_points = []
let rotate = false;
let mode = 0;
let alpha = 50

// NOT WORKING
const AttractorInterface = {
    attractorSize: 1,
    default_conf: {
        x: 1,
        y: 1,
        z: 0
    },
    build: () => {
        throw "this function must first be implemented before calling"
    },
    draw: () => {
        push()
        beginShape()
        all_points.forEach(function (v) {
            vertex(v.x, v.y, v.z)
        })
        endShape()
        pop()
    }
}


function fillSelectHTMLOption() {
    let selector = document.getElementById("selector")
    for (let a of all_attractors) {
        let opt = document.createElement('option');
        opt.value = a[0];
        opt.innerHTML = a[0];
        selector.appendChild(opt);
    }
}

function setup() {
    fillSelectHTMLOption()
    createCanvas(windowWidth, windowHeight, WEBGL);
    //z = random(1);
    background(255);
    //blendMode(ADD);
    //fill(255);
    selected_attractor = new LorenzSystem()
    let def_conf = selected_attractor.default_conf
    x = def_conf.x
    y = def_conf.y
    z = def_conf.z

}

function LorenzSystem() {
    this.attractorSize = 9
    let rho = 28.0
    let sigma = 10.0
    let beta = 8.0 / 3.0
    this.build = () => {
        let dt = 0.01
        let dx = (sigma * (y - x)) * dt
        let dy = (x * (rho - z) - y) * dt
        let dz = (x * y - beta * z) * dt

        x += dx;
        y += dy;
        z += dz;

        let v = createVector(x, y, z)
        all_points.push(v)
    }
}

LorenzSystem.prototype = AttractorInterface

function RosslerSystem() {
    this.attractorSize = 10
    let a = 0.1
    let b = 0.1
    let c = 14
    this.build = () => {
        let dt = 0.05
        let dx = (-y - z) * dt
        let dy = (x + (a * y)) * dt
        let dz = (b + z * (x - c)) * dt

        x += dx;
        y += dy;
        z += dz;

        let v = createVector(x, y, z)
        all_points.push(v)
    }
}

RosslerSystem.prototype = AttractorInterface

/*
function HenonMap() {
    this.attractorSize = 200
    let a = 1.4
    let b = 0.3
    this.build = () => {
        x = (1.0 - (a * x * x) + y)
        y = (x * b)

        let v = createVector(x, y, z)
        all_points.push(v)
    }
}

HenonMap.prototype = AttractorInterface*/

function LuChen() {
    this.default_conf = {
        x: 0.1,
        y: 0.3,
        z: -0.6
    }
    this.attractorSize = 1
    let a = 36.0
    let b = 3.0
    let c = 20.0
    let u = -15.15
    this.build = () => {
        let dt = 0.01
        let dx = (y - x) * a * dt
        let dy = ((c - a) * x - x + c * y + u) * dt
        let dz = (x * y - b * z) * dt

        x += dx;
        y += dy;
        z += dz;

        let v = createVector(x, y, z)
        all_points.push(v)
    }
}

LuChen.prototype = AttractorInterface

function ModifiedChua() {
    this.default_conf = {
        x: 1,
        y: 1,
        z: 0
    }
    this.attractorSize = 20
    let alpha = 10.82
    let beta = 14.286
    let a = 1.3
    let b = 0.11
    let c = 7
    this.build = () => {
        let h = -b * sin((PI * x) / (2 * a))
        let dt = 0.05
        let dx = (alpha * (y - h)) * dt
        let dy = (x - y + z) * dt
        let dz = (-beta * y) * dt

        x += dx;
        y += dy;
        z += dz;

        let v = createVector(x, y, z)
        all_points.push(v)
    }
}

ModifiedChua.prototype = AttractorInterface

function onSelect(attractor_selected) {
    all_points = []
    let attractor_f = attractorMap.get(attractor_selected.value)
    selected_attractor = new attractor_f
    let default_conf = selected_attractor.default_conf
    x = default_conf.x
    y = default_conf.y
    z = default_conf.z

}

function mouseClicked() {
    if (mouseButton === LEFT) {
        rotate = !rotate
    }
}

function draw() {
    background(0)


    selected_attractor.build()


    push()
    scale(selected_attractor.attractorSize)
    stroke(200)
    noFill()
    //orbitControl(5,5)
    if (rotate) {
        rotateX(0.01 * frameCount * PI)
    }
    selected_attractor.draw()
    pop()

}
