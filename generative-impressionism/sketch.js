var strokeLength = 35;
var strokeThickness = 10;
var noiseScale = 0.005;

var imgNames = ["imgs/p10.jpg", "imgs/p9.jpeg", "imgs/p8.jpg", "imgs/p7.jpg", "imgs/p6.jpeg", "imgs/p5.jpg", "imgs/p4.jpg", "imgs/p1.jpg", "imgs/p2.jpeg", "imgs/p3.jpeg", "imgs/devils-bridge.jpg"];
var imgs = [];
var imgIndex = -1;

var drawLength = 250
var frame;


function preload() {
    for (let i = 0; i < imgNames.length; i++) {
        imgs.push(loadImage(imgNames[i]));
    }
}


function setup() {
    createCanvas(windowWidth, windowHeight);
    changeImage();
}


function draw() {
    if (frame > drawLength) {
        return;
    }

    let img = imgs[imgIndex];

    translate(
        width / 2 - img.width / 2,
        height / 2 - img.height / 2
    );

    let count = map(frame, 0, drawLength, 2, 100);

    for (let i = 0; i < count; i++) {
        let x = int(random(img.width))
        let y = int(random(img.height))

        let index = (y * img.width + x) * 4;

        let r = img.pixels[index];
        let g = img.pixels[index + 1];
        let b = img.pixels[index + 2];
        let a = img.pixels[index + 3];

        stroke(r, g, b, a);

        let strokeThickness = map(frame, 0, drawLength, 35, 2);
        strokeWeight(strokeThickness);

        push();
        translate(x, y)
        let n = noise(x * noiseScale, y * noiseScale);
        rotate(radians(map(n, 0, 1, -180, 180)));

        let lengthVariation = random(0.75, 1.25);
        line(0, 0, strokeLength * lengthVariation, 0);

        stroke(min(r * 3, 255), min(g * 3, 255), min(b * 3, 255), random(100));
        strokeWeight(strokeThickness * 0.8);
        line(0, -strokeThickness * 0.15, strokeLength * lengthVariation, -strokeThickness * 0.15);
        pop();
    }

    frame++;
}


function changeImage() {
    background(255);

    frame = 0;
    noiseSeed(int(random(1000)));

    imgIndex++;
    if (imgIndex >= imgNames.length) {
        imgIndex = 0;
    }

    imgs[imgIndex].loadPixels();
    drawLength = imgs[imgIndex].width / 2

}


function mousePressed() {
    if (mouseButton === RIGHT) {
        let canvas = document.getElementsByClassName("p5Canvas")
        let img = canvas.toDataURL("image/jpeg");
    }
    changeImage();
}