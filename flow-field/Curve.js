// A curve is an array of points
class Curve extends Array {
    constructor(...args) {
        super(...args);
    }

    // Returns an array with the same size as this curve where each element
    // is the total arc length at that point
    arcLength() {
        let q = this[0];
        let r = 0;
        let per = [];
        per[0] = 0;
        for (let i = 1; i < this.length; i++) {
            var p = this[i];
            r += p.dist(q);
            per[i] = r;
            q = p;
        }
        return per;
    }

    // Total length of the curve
    perimeter() {
        return this.arcLength()[this.length - 1];
    }

    // Returns the area enclosed by the curve
    area() {
        let s = 0.0;
        for (let i = 0; i < this.length; i++) {
            let j = (i + 1) % this.length;
            s += this[i].x * this[j].y;
            s -= this[i].y * this[j].x;
        }
        return s;
    }

    // Centroid of the curve
    centroid() {
        let p = Vec();
        for (let q of this) {
            p.x += q.x;
            p.y += q.y;
        }
        p.x /= this.length;
        p.y /= this.length;
        return p;
    }

    // A minimum bounding rectangle for the curve
    mbr() {
        let r = new MBR();
        for (let p of this) r.add(p);
        return r;
    }

    // Returns true if this curve (assuming it represents a closed simple polygon)
    // contains point p.
    // contains(p) {
    //   if (this.length < 3) return false;
    //   let a = this[this.length - 1];
    //   let closest = [];
    //   let dist = Number.POSITIVE_INFINITY;
    //   for (let b of this) {
    //     let d = p.distSegment(a, b);
    //     if (d < dist && a.dist(b) >= 1) {
    //       closest = [a, b];
}