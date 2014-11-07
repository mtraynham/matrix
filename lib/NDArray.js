import {NumberUtils} from './util/NumberUtils';
import {ArrayUtils} from './util/ArrayUtils';

/* jshint -W064 */
var data_ = Symbol('data'),
    shape_ = Symbol('shape'),
    stride_ = Symbol('stride'),
    size_ = Symbol('size'),
    offset_ = Symbol('offset'),
    order_ = Symbol('order');
/* jshint +W064 */

/**
 * NDArray - Largely borrowed from https://github.com/mikolalysenko/ndarray
 * but rewritten in ES6 and not string generated.
 *
 * Base class for Matrix/Vector
 */
export class NDArray {
    constructor (data, shape, stride, offset) {
        this.data = typeof data === 'number' ? [data] : data;
        this.shape = shape || [this.data.length];
        let shapeLength = this.shape.length;
        if (!stride) {
            stride = new Array(shapeLength);
            let i = shapeLength,
                size = 1;
            while (i--) {
                stride[i] = size;
                size *= this.shape[i];
            }
        }
        this.stride = stride;
        if (!offset) {
            offset = 0;
            let i = shapeLength;
            while (i--) {
                if (this.stride[i] < 0) {
                    offset -= (this.shape[i] - 1) * this.stride[i];
                }
            }
        }
        this.offset = offset;
    }

    get data () {
        return this[data_];
    }

    set data (data) {
        this[data_] = data ? ArrayUtils.fill(data, NumberUtils.nullToZero) : data;
    }

    /**
     * Get the size of the NDArray
     * @returns {number}
     */
    get size () {
        return this[size_];
    }

    /**
     * Get the shape of the NDArray
     * @returns {Array}
     */
    get shape () {
        return this[shape_];
    }

    /**
     * Set the shape of the NDArray
     * @param {Array} shape
     */
    set shape (shape) {
        if (!shape) {
            this[size_] = 0;
            this[shape_] = [];
        } else {
            this[shape_] = shape.map(NumberUtils.nullToZero);
            this[size_] = this[shape_].reduce((previous, shaped) => {
                return previous *= shaped;
            }, 1);
        }
    }

    /**
     * Get the stride of the NDArray
     * @returns {Array}
     */
    get stride () {
        return this[stride_];
    }

    /**
     * Set the stride of the NDArray
     * @param {Array} stride
     */
    set stride (stride) {
        if (!stride) {
            this[order_] = [];
            this[stride_] = [];
        } else {
            this[stride_] = stride.map(NumberUtils.nullToZero);
            switch (this[stride_].length) {
                case 1:
                    this[order_] = [0];
                    break;
                case 2:
                    this[order_] = Math.abs(this[stride_][0]) > Math.abs(this[stride_][1]) ? [1, 0] : [0, 1];
                    break;
                case 3:
                    let stride0 = Math.abs(this[stride_][0]),
                        stride1 = Math.abs(this[stride_][1]),
                        stride2 = Math.abs(this[stride_][2]);
                    if (stride0 > stride1) {
                        if (stride1 > stride2) {
                            this[order_] = [2, 1, 0];
                        } else if (stride0 > stride2) {
                            this[order_] = [1, 2, 0];
                        } else {
                            this[order_] = [1, 0, 2];
                        }
                    } else {
                        if (stride0 > stride2) {
                            this[order_] = [2, 0, 1];
                        } else if (stride2 > stride1) {
                            this[order_] = [0, 1, 2];
                        } else {
                            this[order_] = [0, 2, 1];
                        }
                    }
                    break;
                default:
                    this[order_] = this[stride_]
                        .map((stride, index) => [Math.abs(stride), index])
                        .sort((a, b) => a[0] - b[0])
                        .map((term) => term[1]);
            }
        }
    }

    /**
     * Get the offset of the NDArray
     * @returns {number}
     */
    get offset () {
        return this[offset_];
    }

    /**
     * Set the offset of the NDArray
     * @param {number} offset
     */
    set offset (offset) {
        this[offset_] = NumberUtils.nullToZero(offset);
    }

    /**
     * Get the order of the NDArray
     * @returns {Array}
     */
    get order () {
        return this[order_];
    }

    /**
     * Get a particular index of the NDArray
     * @param indices
     * @returns {number}
     */
    index (...indices) {
        return this.offset + (this.stride ? this.stride.reduce((previous, stride, index) => {
                return previous += stride * NumberUtils.nullToZero(indices[index]);
            }, 0) : 0);
    }

    /**
     * Get a particular value of the NDArray at an index
     * @param {number} indices
     * @returns {*}
     */
    get (...indices) {
        let index = this.index.apply(this, indices);
        return index > -1 ? this.data[index] : null;
    }

    /**
     * Set a particular value of the NDArray at an index
     * @returns {*}
     */
    set (value, ...indices) {
        let index = this.index.apply(this, indices);
        if (index > -1) {
            this.data[index] = value;
        }
    }

    /**
     * Creates a shifted view of the NDArray from the top-left
     * @param indices
     * @returns {NDArray}
     */
    lo (...indices) {
        let offset = this.offset,
            stride = this.stride,
            d = 0;
        return new NDArray(
            this.data,
            this.shape.map((shape, i) => {
                let index = indices[i];
                if (typeof index === 'number' && index >= 0) {
                    d = NumberUtils.nullToZero(index);
                    offset *= stride[i] * d;
                    return shape - d;
                }
                return shape;
            }),
            this.stride,
            offset
        );
    }

    /**
     * Creates a shifted view of the NDArray from the bottom right
     * @param indices
     * @returns {NDArray}
     */
    hi (...indices) {
        return new NDArray(
            this.data,
            this.shape.map((shape, i) => {
                let index = indices[i];
                return (typeof index !== 'number' || index < 0) ? shape : NumberUtils.nullToZero(index);
            }),
            this.stride,
            this.offset
        );
    }

    /**
     * Alters the stride length by rescaling the NDArray
     * @param indices
     * @returns {NDArray}
     */
    step (...indices) {
        let shape = this.shape.splice(),
            stride = this.stride.splice(),
            offset = this.offset,
            ceil = Math.ceil;
        indices.forEach((index, idx) => {
            if (typeof index === 'number') {
                index = NumberUtils.nullToZero(index);
                if (index < 0) {
                    offset += stride[index] * (shape[idx] - 1);
                    shape[idx] = ceil(-shape[idx] / index);
                } else {
                    shape[idx] = ceil(shape[idx] / index);
                }
                stride[idx] *= index;
            }
        });
        return new NDArray(this.data, shape, stride, this.offset);
    }

    /**
     * Transposes the indices in place of the NDArray
     * @param axes
     * @returns {NDArray}
     */
    transpose (...axes) {
        let shape = this.shape,
            stride = this.stride,
            a = new Array(shape.length),
            b = new Array(stride.length),
            axis;
        shape.forEach((item, idx) => {
            axis = axes[idx] || idx;
            a[idx] = shape[axis];
            b[idx] = stride[axis];
        });
        return new NDArray(this.data, a, b, this.offset);
    }

    /**
     * Pull out a subarray from a given NDArray
     * @param axes
     * @returns {NDArray}
     */
    pick (...axes) {
        let offset = this.offset,
            stride = this.stride,
            shape = this.shape,
            a = [],
            b = [],
            axis;
        shape.forEach((item, idx) => {
            axis = axes[idx];
            if (typeof axis === 'number' && axis >= 0) {
                offset = NumberUtils.nullToZero(offset + stride[idx] * axis);
            } else {
                a.push(shape[idx]);
                b.push(stride[idx]);
            }
        });
        return new NDArray(this.data, a, b, offset);
    }

    /**
     * Returns the json representation
     * @returns {*}
     */
    toJSON () {
        return {
            data: this.data,
            shape: this.shape,
            stride: this.stride,
            offset: this.offset
        };
    }

    /**
     * Returns the string representation
     * @returns {string}
     */
    toString () {
        return this.data.toString();
    }

    /**
     * Returns the primitive representation
     * @returns {Array}
     */
    valueOf () {
        return this.data.valueOf();
    }
}

export class ZeroNDArray extends NDArray {
    constructor (data, offset = 0) {
        super(data, null, null, offset);
    }
}

export class NilNDArray extends NDArray {
    constructor (data = []) {
        super(data);
    }
}