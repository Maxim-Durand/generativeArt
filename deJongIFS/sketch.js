let a
let b
let c
let d

let x;
let y;
let z;
let e = 0.7, f = -1.1;
let clr1, clr2, clr3;

let paused = false;
let mode = 0;
let cal = 0; //记录次数

let alpha = 50
let abstractorSize = 2

function setup() {
    createCanvas(windowWidth, windowHeight);
    a = random(-3, 5);
    b = random(-3, 5);
    c = random(-3, 5);
    d = random(-3, 5);
    z = random(1);
    background(25);
    //blendMode(ADD);
    //fill(255);
    noStroke();

    x = 0;
    y = 0;
}


function draw() {
    translate(width / 2, height / 2);
    let base = random(128);

    if (mode === 2) {
        a = -0.06;
        b = 2.84;
        c = -0.69;
        d = -1.76;

    }
    for (let i = 0; i < 10000; i++) {
        let x_next = abstractorSize * (sin(a * y) - cos(b * x));
        let y_next = abstractorSize * (sin(c * x) - cos(d * y));


        fill(64, 128, 174, alpha);

        if (mode === 0) {
            ellipse(x_next * 100, y_next * 100, 1, 1);
        } else if (mode === 1) {
            ellipse(x_next * 300 * sin(map(i, 1, 10000, 0, 2 * PI)), y_next * 300 * sin(map(i, 1, 10000, 0, 2 * PI)), 1, 1);
        } else if (mode === 2) {
            ellipse(x_next * random(300), y_next * random(300), 1, 1);
        }

        fill(255);
        textSize(40);
        let base_height = height/4;

        if (cal > 450000) {
            text("a: " + a, 500, height / 2 - base_height - 200);
            text("b: " + b, 500, height / 2 - base_height - 150);
            text("c: " + c, 500, height / 2 - base_height - 100);
            text("d: " + d, 500, height / 2 - base_height - 50);
            text("Mode: " + mode, 500, height / 2 - base_height);
        }
        //println(x_next, y_next);
        x = x_next;
        y = y_next;
    }

    cal += 10000;


    if (cal >= 500000) {
        newLoop();
        cal = 0;
    }
}

function newLoop() {
    background(0);
    a = random(-5, 5);
    b = random(-5, 5);
    c = random(-5, 5);
    d = random(-5, 5);

    mode = 0
    //mode = int(random(3));
}

function mouseClicked() {
    paused = !paused;
    if (paused) {
        noLoop();
    } else {
        loop();
    }

}
