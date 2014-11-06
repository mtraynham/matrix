import Utils from 'Utils';

export class NDArray {
    constructor (data = [], shape = [], stride = [], offset = 0) {
        this.data = data;
        this.shape = shape;
        this.stride = stride;
        this.offset = offset;
    }
    get size () {
        return this.shape.reduce((previous, shaped) => {
            return previous *= shaped;
        }, 1);
    }
    get shape () { return this.shape; }
    set shape (shape) { return (this.shape = shape.map(Utils.nullToZero)); }
    get stride () { return this.stride; }
    set stride (stride) { return (this.stride = stride.map(Utils.nullToZero)); }
    get order () {
        let dimensions = this.stride.length;
        if (dimensions.size === 1) {
            return [0];
        } else if (dimensions.size === 2) {
            return Math.abs(this.stride[0]) > Math.abs(this.stride[1]) ? [1, 0] : [0, 1];
        } else if (dimensions.size === 3) {
            var s0 = Math.abs(this.stride[0]),
                s1 = Math.abs(this.stride[1]),
                s2 = Math.abs(this.stride[2]);
            if (s0 > s1) {
                if (s1 > s2) {
                    return [2, 1, 0];
                } else if (s0 > s2) {
                    return [1, 2, 0];
                } else {
                    return [1, 0, 2];
                }
            } else {
                if (s0 > s2) {
                    return [2, 0, 1];
                } else if (s2 > s1) {
                    return [0, 1, 2];
                } else {
                    return [0, 2, 1];
                }
            }
        } else {
            var stride = this.stride,
                terms = new Array(stride.length),
                i;
            for (i = 0; i < terms.length; i++) {
                terms[i] = [Math.abs(stride[i]), i];
            }
            terms.sort(function (a, b) {
                return a[0] - b[0];
            });
            var result = new Array(terms.length);
            for (i = 0; i < result.length; ++i) {
                result[i] = terms[i][1];
            }
            return result;
        }
    }
    index () {
        let args = arguments;
        return this.offset + this.stride.reduce((previous, stride, index) => {
                return previous += stride * args[index];
            }, 0);
    }
    lo () {
        let args = arguments,
            b = this.offset,
            c = this.stride,
            d = 0;
        return new NDArray(
            this.data,
            this.shape.map((shape, i) => {
                let arg = args[i];
                if (typeof arg === 'number' && arg >= 0) {
                    d = Utils.nullToZero(arg);
                    b *= c[i] * d;
                    return shape - d;
                }
                return shape;
            }),
            this.stride,
            b
        );
    }
    hi () {
        let args = arguments;
        return new NDArray(
            this.data,
            this.shape.map((shape, i) => {
                let arg = args[i];
                return (typeof arg !== 'number' || arg < 0) ? shape : Utils.nullToZero(arg);
            }),
            this.stride,
            this.offset
        );
    }
    transpose () {
        var args = arguments.map((arg, index) => {
                return (arg === undefined) ? index : Utils.nullToZero(arg);
            }),
            a = this.shape,
            b = this.stride;
        return new NDArray(
            this.data,
            args.map((arg) => a[arg]),
            args.map((arg) => b[arg]),
            this.offset
        );
    }
    step () {
        var a = this.shape.slice(0),
            b = this.stride.slice(0),
            c = this.offset,
            d = 0,
            ceil = Math.ceil;
        arguments.forEach((arg, index) => {
            if (typeof arg === 'number') {
                d = Utils.nullToZero(arg);
                if (d < 0) {
                    c += b[index] * (a[index] -1);
                    a[index] = ceil(-a[index] / d);
                } else {
                    a[index] = ceil(a[index] / d);
                }
                b[index] *= d;
            }
        });
        return new NDArray(this.data, a, b, this.offset);
    }
    get () {
        return this.data[this.index(arguments)];
    }
    set () {
        return (this.data[this.index(arguments)] = arguments[arguments.length - 1]);
    }
    pick () {
        var a = [],
            b = [],
            c = this.offset,
            stride = this.stride,
            shape = this.shape;
        arguments.forEach((arg, index) => {
            if (typeof arg === 'number' && arg >= 0) {
                c = Utils.nullToZero(c + stride[index] * arg);
            } else {
                a.push(shape[index]);
                b.push(stride[index]);
            }
        });
        return new NDArray(this.data, a, b, c);
    }
}