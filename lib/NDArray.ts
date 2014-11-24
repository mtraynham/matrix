/// <reference path="util/ArrayUtils.ts"/>
/// <reference path="util/NumberUtils.ts"/>

import numberUtils = require('./util/NumberUtils');
var NumberUtils = numberUtils.NumberUtils;
import arrayUtils = require('./util/ArrayUtils');
var ArrayUtils = arrayUtils.ArrayUtils;

interface INDArray<T> {
    data: Array<T>;
    shape: Array<Number>;
    stride: Array<Number>;
    size: Number;
    order: Array<Number>;
    index (...indices: Number[]): Number;
    get (...indices: Number[]): T;
    set (value: T, ...indices: Number[]);
    lo (...indices: Number[]): INDArray;
    hi (...indices: Number[]): INDArray;
    step (...indices: Number[]): INDArray;
    transpose (...axes: Number[]): INDArray;
    pick (...axes: Number[]): INDArray;
    toJSON ();
}

/**
 * NDArray - Largely borrowed from https://github.com/mikolalysenko/ndarray
 * but rewritten in ES6 and not string generated.
 *
 * Base class for Matrix/Vector
 */
export class NDArray<T> implements INDArray<T> {
    private _data: Array<T>;
    private _shape: Array<Number>;
    private _stride: Array<Number>;
    private _size: Number;
    private _order: Array<Number>;
    private _offset: Number;

    /**
     * Create an NDArray
     * @param {T} data
     * @param {Array<Number>} shape
     * @param {Array<Number>} stride
     * @param {Number} offset
     */
    constructor (data?: T, shape?: Array<Number>, stride?: Array<Number>, offset?: Array<Number>) {
        this([data], shape, stride, offset);
    }

    /**
     * Create an NDArray
     * @param {Array<T>} data
     * @param {Array<Number>} shape
     * @param {Array<Number>} stride
     * @param {Number} offset
     */
    constructor (data?: Array<T>, shape?: Array<Number>, stride?: Array<Number>, offset?: Number) {
        this.data = data;
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

    /**
     * Get data
     * @returns {Array<T>}
     */
    public get data () {
        return this._data;
    }

    /**
     * Set data
     * @param {Array<T>} data
     */
    public set data (data: Array<T>) {
        this._data = data ? ArrayUtils.fillNull(data) : data;
    }

    /**
     * Get the size of the NDArray
     * @returns {Number}
     */
    public get size () {
        return this._size;
    }

    /**
     * Get the shape of the NDArray
     * @returns {Array<Number>}
     */
    public get shape () {
        return this._shape;
    }

    /**
     * Set the shape of the NDArray
     * @param {Array<Number>} shape
     */
    public set shape (shape: Array<Number>) {
        if (!shape) {
            this._size = 0;
            this._shape = [];
        } else {
            this._shape = shape.map(NumberUtils.bitwiseFloor);
            this._size = this._shape.reduce((previous, shaped) => {
                return previous *= shaped;
            }, 1);
        }
    }

    /**
     * Get the stride of the NDArray
     * @returns {Array<Number>}
     */
    public get stride () {
        return this._stride;
    }

    /**
     * Set the stride of the NDArray
     * @param {Array<Number>} stride
     */
    public set stride (stride: Array<Number>) {
        if (!stride) {
            this._order = [];
            this._stride = [];
        } else {
            this._stride = stride.map(NumberUtils.bitwiseFloor);
            switch (this._stride.length) {
                case 1:
                    this._order = [0];
                    break;
                case 2:
                    this._order = Math.abs(this._stride[0]) > Math.abs(this._stride[1]) ? [1, 0] : [0, 1];
                    break;
                case 3:
                    let stride0 = Math.abs(this._stride[0]),
                        stride1 = Math.abs(this._stride[1]),
                        stride2 = Math.abs(this._stride[2]);
                    if (stride0 > stride1) {
                        if (stride1 > stride2) {
                            this._order = [2, 1, 0];
                        } else if (stride0 > stride2) {
                            this._order = [1, 2, 0];
                        } else {
                            this._order = [1, 0, 2];
                        }
                    } else {
                        if (stride0 > stride2) {
                            this._order = [2, 0, 1];
                        } else if (stride2 > stride1) {
                            this._order = [0, 1, 2];
                        } else {
                            this._order = [0, 2, 1];
                        }
                    }
                    break;
                default:
                    this._order = this._stride
                        .map((stride, index) => [Math.abs(stride), index])
                        .sort((a, b) => a[0] - b[0])
                        .map((term) => term[1]);
            }
        }
    }

    /**
     * Get the offset of the NDArray
     * @returns {Number}
     */
    public get offset () {
        return this._offset;
    }

    /**
     * Set the offset of the NDArray
     * @param {Number} offset
     */
    public set offset (offset: Number) {
        this._offset = NumberUtils.bitwiseFloor(offset);
    }

    /**
     * Get the order of the NDArray
     * @returns {Array<Number>}
     */
    public get order () {
        return this._order;
    }

    /**
     * Get a particular index of the NDArray
     * @param {Number} indices
     * @returns {Number}
     */
    public index (...indices: Number[]) {
        return this.offset + (this.stride ? this.stride.reduce((previous, stride, index) => {
                return previous += stride * NumberUtils.bitwiseFloor(indices[index]);
            }, 0) : 0);
    }

    /**
     * Get a particular value of the NDArray at an index
     * @param {...Number} indices
     * @returns {T}
     */
    public get (...indices: Number[]) {
        let index = this.index.apply(this, indices);
        return index > -1 ? this.data[index] : null;
    }

    /**
     * Set a particular value of the NDArray at an index
     * @param {T} value
     * @param {...Number} indices
     */
    public set (value, ...indices: Number[]) {
        let index = this.index.apply(this, indices);
        if (index > -1) {
            this.data[index] = value;
        }
    }

    /**
     * Creates a shifted view of the NDArray from the top-left
     * @param {...Number} indices
     * @returns {NDArray}
     */
    public lo (...indices: Number[]) {
        let offset = this.offset,
            stride = this.stride,
            d = 0;
        return new NDArray(
            this.data,
            this.shape.map((shape, i) => {
                let index = indices[i];
                if (typeof index === 'number' && index >= 0) {
                    d = NumberUtils.bitwiseFloor(index);
                    offset *= stride[i] * d;
                    return shape - d;
                }
                return shape;
            }),
            stride,
            offset
        );
    }

    /**
     * Creates a shifted view of the NDArray from the bottom right
     * @param {...Number} indices
     * @returns {NDArray}
     */
    public hi (...indices: Number[]) {
        return new NDArray(
            this.data,
            this.shape.map((shape, i) => {
                let index = indices[i];
                return (typeof index !== 'number' || index < 0) ? shape : NumberUtils.bitwiseFloor(index);
            }),
            this.stride,
            this.offset
        );
    }

    /**
     * Alters the stride length by rescaling the NDArray
     * @param {...Number} indices
     * @returns {NDArray}
     */
    public step (...indices: Number[]) {
        let shape = this._shape.slice(0),
            stride = this._stride.slice(0),
            offset = this.offset,
            ceil = Math.ceil;
        indices.forEach((index, idx) => {
            if (typeof index === 'number') {
                index = NumberUtils.bitwiseFloor(index);
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
     * @param {...Number} axes
     * @returns {NDArray}
     */
    public transpose (...axes: Number[]) {
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
     * @param {...Number} axes
     * @returns {NDArray}
     */
    public pick (...axes: Number[]) {
        let offset = this.offset,
            stride = this.stride,
            shape = this.shape,
            a = [],
            b = [],
            axis;
        shape.forEach((item, idx) => {
            axis = axes[idx];
            if (typeof axis === 'number' && axis >= 0) {
                offset = NumberUtils.bitwiseFloor(offset + stride[idx] * axis);
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
    public toJSON () {
        return {
            data: this.data,
            shape: this.shape,
            stride: this.stride,
            offset: this.offset
        };
    }

    /**
     * Returns the string representation
     * @returns {String}
     */
    public toString () {
        return this.data.toString();
    }

    /**
     * Returns the primitive representation
     * @returns {Array<Number>}
     */
    public valueOf () {
        return this.data.valueOf();
    }
}

/**
 * A Zero Dimensioned NDArray
 */
export class ZeroNDArray<T> extends NDArray<T> {
    /**
     * Create an ZeroNDArray
     * @param {Array<T>} data
     * @param {Number} offset
     */
    constructor (data: T, offset = 0) {
        super([data], null, null, offset);
    }

    /**
     * Create an ZeroNDArray
     * @param {Array<T>} data
     * @param {Number} offset
     */
    constructor (data: Array<T>, offset = 0) {
        super(data, null, null, offset);
    }
}

/**
 * A Nil Dimensioned NDArray
 */
export class NilNDArray<T> extends NDArray<T> {
    /**
     * Create an NilNDArray
     * @param {Array<T>|T} data
     */
    constructor (data: T = []) {
        super(data);
    }

    /**
     * Create an NilNDArray
     * @param {Array<T>|T} data
     */
    constructor (data: Array<T> = []) {
        super(data);
    }
}
