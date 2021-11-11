let colors = ["#eecf6d","#d5ac4e","#8b6220","#720e07","#45050c"]
let time = 0.05
function setup() {
    createCanvas(windowWidth, windowHeight,WEBGL);
    //pixelDensity(1);
    smooth()
	frameRate(1)
    background(0)
}


function draw() {
	time += 0.05
    const centerPoint = {
        y: windowHeight / 2,
        x: windowWidth / 2
    }

    background(0)
	for(let i =0; i < 3; i++){
		time += 0.5
		let c = random(colors)
		fill(red(c),green(c),blue(c),200);
		//stroke(red(c),green(c),blue(c),50)
		noStroke()
		//strokeWeight(2)
		beginShape()
		for (let angle = 0; angle <= TWO_PI * 2; angle = angle + PI * 0.01) {
			let r = noise(time + centerPoint.x + centerPoint.y, cos(angle) +1 , 1+ sin(angle)) * windowWidth/2 - 100*i
			x =  r * cos(angle)
			y = r * sin(angle)
			vertex(x,y)
		}
		endShape()
	}
	push()
	fill(0,250)
	strokeWeight(2)
	stroke(0)
	smooth()
	beginShape()
	circle(0,0,windowWidth/2 -500)
	endShape()
	pop()

	//noLoop()

}

function mousePressed() {
    background(0)
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}