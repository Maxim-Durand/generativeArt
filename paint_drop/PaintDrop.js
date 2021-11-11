class PaintDrop {
    all_points = []


    absolute(num) {
        return num < 0 ? -num : num
    }


    randomPointBetween(x1, y1, x2, y2, lvl) {
        let where = randomGaussian(0.5, 0.2)
        let pX = lerp(x1, x2, where)
        let pY = lerp(y1, y2, where)

        let x = x1 - x2
        let y = y1 - y2
        let amplitude = this.absolute(randomGaussian(width * (2*lvl)/100, 1))

        let randomAngle = randomGaussian(PI / 2, 1)

        let vX = pX + x * cos(randomAngle) - y * sin(randomAngle)
        let vY = pY + x * sin(randomAngle) + y * cos(randomAngle)

        let normalVector = createVector(vX, vY)
        normalVector.setMag(amplitude)

        return [pX+normalVector.x, pY+normalVector.y]
    }

    recursivelyEdge(p1, p2, level) {
        if (level < 1) {
            return 0
        }
        let r = this.randomPointBetween(p1.x, p1.y, p2.x, p2.y, level)
        let newP = {x: r[0], y: r[1]}
        let p1_idx = this.all_points.findIndex((point) => {
            return point.x === p1.x && point.y === p1.y
        })
        if (p1_idx !== -1) {
            this.all_points.splice(p1_idx + 1, 0, newP)
        }
        let nextLevel = level - 1

        this.recursivelyEdge(p1, newP, nextLevel)
        this.recursivelyEdge(newP, p2, nextLevel)
    }

    drawRecursivePolygon(x, y, radius, polygonNpoints, borderLoopNumber, addedVertex) {
        let angle = TWO_PI / polygonNpoints;
        for (let a = 0; a < TWO_PI; a += angle) {
            let sx = x + cos(a) * radius;
            let sy = y + sin(a) * radius;
            let nP = {
                x: sx,
                y: sy
            } // New point
            this.all_points.push(nP)
        }
        let first_points = this.all_points.slice()
        for (let [idx, p] of first_points.entries()) {
            if (idx < first_points.length - 1) {
                let tmp = first_points[idx + 1]
                this.recursivelyEdge(p, tmp, borderLoopNumber)
            } else {
                this.recursivelyEdge(p, first_points[0], borderLoopNumber)
            }
        }

        beginShape();
        for (let p of this.all_points) {
            if (!addedVertex) {
                if (first_points.find((point) => {
                    return p.x === point.x && p.y === point.y
                })) {
                    vertex(p.x, p.y)
                } else {
                    strokeWeight(10)
                    point(p.x, p.y)
                }
            } else {
                vertex(p.x, p.y)
            }
        }
        endShape(CLOSE);
    }

    drawPaintDrop(){
        let NLayer = 50
        let opacity = 10
        for(let i = 0 ;i < NLayer ; i++){
            push();
            noStroke()
            fill(255, 0, 50,opacity)
            translate(width * 0.5, height * 0.5);
            this.all_points = []
            this.drawRecursivePolygon(0, 0, width / 4, 12, 6,true);
            pop();
        }
    }
}