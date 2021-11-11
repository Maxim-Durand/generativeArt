let time = 0.05

function setup() {
    createCanvas(windowWidth, windowHeight);
    // put setup code here
}

function polygon(x, y, radius, npoints) {
    let angle = TWO_PI / npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius;
        let sy = y + sin(a) * radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function absolute(num) {
    return num < 0 ? -num : num
}


function mousePressed() {
    text("(" + mouseX + ", " + mouseY + ")", mouseX, mouseY);
}

/*
    Returns the angle between two points in radians. Values are between 0 and 2 * PI."
 */
function angle(x1, y1, x2, y2) {
    let a = atan2(y2 - y1, x2 - x1)
    if (a < 0) {
        return a + 2.0 * PI
    }
    return a
}

function draw() {
    background(200)
    translate(width * 0.5, height * 0.5);
    colors = []
    let colorSelector = new ColorSelector(colors)
    colorSelector.onlyOneColor("#FF5C58")
    let paintDrop = new PaintDrop(0, 0, width / 4, 12, 6, 50, 10)
    paintDrop.setColorSelector(colorSelector)
    paintDrop.drawPaintDrop()
    noLoop()
}
