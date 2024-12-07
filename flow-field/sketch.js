let grid

function setup() {
    createCanvas(windowWidth, windowHeight,WEBGL);

    grid = new GridField(0.5, 0.01,20)
    // put setup code here
}

let angleLerp = (a0, a1, t) => {
    let max = Math.PI * 2;

    function shortAngleDist(a0, a1) {
        let da = Math.sign(a1 - a0) * (Math.abs(a1 - a0) % max);
        return Math.sign(a1 - a0) * ((2 * Math.abs(da)) % max) - da;
        // var da = (a1 - a0) % max;
        // return ((2 * da) % max) - da;
    }

    return a0 + shortAngleDist(a0, a1) * t;
}

class GridField {
    resolution
    grid = []

    constructor(sizePrct, resolutionPrct, cellSize) {
        this.coords = {
            leftX: windowWidth * (0 - sizePrct),
            rightX: windowWidth * (1 + sizePrct),
            topY: windowHeight * (0 - sizePrct),
            botY: windowHeight * (1 + sizePrct)
        }
        this.width = this.coords.rightX - this.coords.leftX
        this.height = abs(this.coords.topY - this.coords.botY)
        this.resolution = int(width * resolutionPrct)
        this.cellSize = cellSize;
        this.num_columns = int((this.coords.rightX - this.coords.leftX) / this.resolution)
        this.num_rows = int((this.coords.botY - this.coords.topY) / this.resolution)
        this.grid = [[]] //[this.num_columns][this.num_rows]
       /* this.nx = Math.round(this.width / cellSize);
        this.ny = Math.round(this.height / cellSize);*/
        this.fillGrid()
    }

    clone() {
        let copy = new GridField(this.width, this.height, this.cellSize);
        copy.grid = [...this.grid.map((row) => [...row])];
        return copy;
    }

    /*getCell(ix, iy) {
        ix = Math.min(this.nx - 1, Math.max(0, ix));
        iy = Math.min(this.ny - 1, Math.max(0, iy));
        return this.grid[ix][iy];
    }

    setCell(ix, iy, angle) {
        if (ix < this.nx && ix >= 0 && iy < this.ny && iy >= 0)
            this.grid[ix][iy] = angle;
    }

    getCellIndex(x, y) {
        return [~~(x / this.cellSize), ~~(y / this.cellSize)];
    }

    getField(x, y) {
        let [ix, iy] = this.getCellIndex(x, y);
        console.log(iy)
        let alphax = (x % this.cellSize) / this.cellSize;
        let alphay = (y % this.cellSize) / this.cellSize;

        return angleLerp(
            angleLerp(this.getCell(ix, iy), this.getCell(ix + 1, iy), alphax),
            angleLerp(this.getCell(ix, iy + 1), this.getCell(ix + 1, iy + 1), alphax),
            alphay
        );
    }*/

    fillGrid() {
        for (let i = 0; i < this.num_columns; i++) {
            let row = []
            for (let j = 0; j < this.num_rows; j++) {
                let computedAngle = noise(j / this.width, i / this.height) * PI * 0.7
                row[j] = computedAngle
            }
            this.grid[i] = row
        }
    }


    drawCurve = (startX, startY, numStep) => {
        let x = startX
        let y = startY
        beginShape()
        while (--numStep > 0) {
            vertex(x, y)
            let x_offset = x - this.coords.leftX
            let y_offset = y - this.coords.topY

            let column_index = int(x_offset / this.resolution)
            let row_index = int(y_offset / this.resolution)

            // NOTE: normally you want to check the bounds here
            let grid_angle = this.grid[column_index][row_index]
            console.log(grid_angle)
            let x_step = this.cellSize * cos(grid_angle)
            let y_step = this.cellSize * sin(grid_angle)

            x = x + x_step
            y = y + y_step
        }
        endShape()
    }

}

function mousePressed() {
    //drawCurve(grid.getFieldCurve(mouseX, mouseY, 1, 500));
}

function draw() {
    noLoop()
    let xOffset = 10
    let yOffset = 0
    let numStep = 50
    grid.fillGrid()
    console.log(grid)
    push()
/*
    translate(-width/2,-height/2)
*/
    for (let i = 0; i < 10; i++) {
        /* let curve = grid.getFieldCurve(xOffset + 10 * i, yOffset + 10 * i, 1, 500)
         drawCurve(curve)*/
        stroke(0)
        grid.drawCurve(xOffset + 10 * i, yOffset + 10 * i, numStep)
    }
    pop()
}
