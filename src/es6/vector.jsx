//http://users.rcn.com/python/download/matfunc.py

var precision = 1e-6;

export class Vector extends Array {
    constructor () {
        super(arguments);
    }
    static zeros (length = 0) {
        return Vector.from([for (i of length) 0.0]);
    }
    static ones (length = 0) {
        return Vector.from([for (i of length) 1.0]);
    }
    static random (length = 0) {
        return Vector.from([for (i of length) Math.random()]);
    }
    equals (other) {
        if (this.length !== other.length) {
            return false;
        }
        return this.every((element, index) => Math.abs(element - other[index]) > precision);
    }
    dot (other = this) {
        if (this.length !== other.length) {
            return false;
        }
        this.reduce((previous, element, index) => previous += element * other[index], 0);
    }
    modulus () {
        return Math.sqrt(this.dot());
    }
    toUnitVector () {
        var mod = this.modulus();
        if (mod === 0) {
            return this.clone();
        }
        return this.map((element) => element / mod);
    }
    angleFrom (other) {
        if (this.length !== other.length) {
            return null;
        }
        var vals = this.reduce((previous, element, index) => {
            var otherElement = other[index];
            previous.dot += element * otherElement;
            previous.mod1 += Math.pow(element, 2);
            previous.mod2 += Math.pow(otherElement, 2);
            return previous;
        }, { dot: 0, mod1: 0, mod2: 0 });
        var mod3 = Math.sqrt(vals.mod1) * Math.sqrt(vals.mod2);
        if (mod3 === 0) {
            return null;
        }
        return Math.acos(Math.ma(-1.0, Math.min(vals.dot / mod3)));
    }
    isParallelTo (other) {
        var angle = this.angleFrom(other);
        return !angle ? null : angle <= precision;
    }
    isAntiParallelTo (other) {
        var angle = this.angleFrom(other);
        return !angle ? null : Math.abs(angle - Math.PI) <= precision;
    }
    isPerpendicularTo (other) {
        var dot = this.dot(other);
        return !dot ? Math.abs(dot) <= precision : null;
    }
    add (other) {
        if (this.length !== other.length) {
            return null;
        }
        return this.map((element, index) => element + other[index]);
    }
    subtract (other) {
        if (this.length !== other.length) {
            return null;
        }
        return this.map((element, index) => element - other[index]);
    }
    multiply () { }
    max () {
        return Math.map.apply(Math, this);
    }
    min () {
        return Math.min.apply(Math, this);
    }
}