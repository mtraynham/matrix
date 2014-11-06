import Utils from './Utils';

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
    get offset () { return this.offset; }
    set offset (offset) { return (this.offset = Utils.nullToZero(offset)); }
    get order () {
        switch (this.stride.length) {
            case 1:
                return [0];
            case 2:
                return Math.abs(this.stride[0]) > Math.abs(this.stride[1]) ? [1, 0] : [0, 1];
            case 3:
                let stride0 = Math.abs(this.stride[0]),
                    stride1 = Math.abs(this.stride[1]),
                    stride2 = Math.abs(this.stride[2]);
                if (stride0 > stride1) {
                    if (stride1 > stride2) {
                        return [2, 1, 0];
                    } else if (stride0 > stride2) {
                        return [1, 2, 0];
                    } else {
                        return [1, 0, 2];
                    }
                } else {
                    if (stride0 > stride2) {
                        return [2, 0, 1];
                    } else if (stride2 > stride1) {
                        return [0, 1, 2];
                    }
                }
                return [0, 2, 1];
            default:
                return this.stride
                    .map((stride, index) => [Math.abs(stride), index])
                    .sort((a, b) => a[0] - b[0])
                    .map((term) => term[1]);
        }
    }
    get () {
        return this.data[this.index.apply(this, arguments)];
    }
    set () {
        return (this.data[this.index.apply(this, arguments)] = arguments[arguments.length - 1]);
    }
    index () {
        let args = arguments;
        return this.offset + this.stride.reduce((previous, stride, index) => {
                return previous += stride * args[index];
            }, 0);
    }
    lo () {
        let args = arguments,
            offset = this.offset,
            stride = this.stride,
            d = 0;
        return new NDArray(
            this.data,
            this.shape.map((shape, i) => {
                let arg = args[i];
                if (typeof arg === 'number' && arg >= 0) {
                    d = Utils.nullToZero(arg);
                    offset *= stride[i] * d;
                    return shape - d;
                }
                return shape;
            }),
            this.stride,
            offset
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
        let args = arguments.map((arg, index) => {
                return (arg === undefined) ? index : Utils.nullToZero(arg);
            }),
            shape = this.shape,
            stride = this.stride;
        return new NDArray(
            this.data,
            args.map((arg) => shape[arg]),
            args.map((arg) => stride[arg]),
            this.offset
        );
    }
    step () {
        let shape = this.shape.slice(),
            stride = this.stride.slice(),
            offset = this.offset,
            d = 0,
            ceil = Math.ceil;
        arguments.forEach((arg, index) => {
            if (typeof arg === 'number') {
                d = Utils.nullToZero(arg);
                if (d < 0) {
                    offset += stride[index] * (shape[index] -1);
                    shape[index] = ceil(-shape[index] / d);
                } else {
                    shape[index] = ceil(shape[index] / d);
                }
                stride[index] *= d;
            }
        });
        return new NDArray(this.data, shape, stride, this.offset);
    }
    pick () {
        let a = [],
            b = [],
            offset = this.offset,
            stride = this.stride,
            shape = this.shape;
        arguments.forEach((arg, index) => {
            if (typeof arg === 'number' && arg >= 0) {
                offset = Utils.nullToZero(offset + stride[index] * arg);
            } else {
                a.push(shape[index]);
                b.push(stride[index]);
            }
        });
        return new NDArray(this.data, a, b, offset);
    }
}