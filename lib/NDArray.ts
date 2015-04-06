import INDArray from './INDArray';
import ArrayUtils from './util/ArrayUtils';


/**
 * NDArray - Largely borrowed from https://github.com/mikolalysenko/ndarray
 * but rewritten in ES6 and not string generated.
 *
 * Base class for Matrix/Vector
 */
class NDArray<T> implements INDArray<T> {
    public data: Array<T>;

    private _data: Array<T>;
    private _shape: Array<number>;
    private _stride: Array<number>;
    private _size: number;
    private _order: Array<number>;
    private _offset: number;

    constructor (data?: T|Array<T>, shape?: Array<number>, stride?: Array<number>, offset?: number) {
        this.data = <Array<T>> (typeof data === 'array' ? data : [data]);
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
                if (this._stride[i] < 0) {
                    offset -= (this.shape[i] - 1) * this.stride[i];
                }
            }
        }
        this._offset = offset;
    }

    public get size () {
        return this._size;
    }

    public get shape (): Array<number> {
        return this._shape;
    }

    public set shape (shape: Array<number>) {
        if (!shape) {
            this._size = 0;
            this._shape = [];
        } else {
            this._shape = shape.map(Math.floor);
            this._size = this._shape.reduce((previous, shaped) => {
                return previous *= shaped;
            }, 1);
        }
    }

    public get stride (): Array<number> {
        return this._stride;
    }

    public set stride (stride: Array<number>) {
        if (!stride) {
            this._order = [];
            this._stride = [];
        } else {
            this._stride = stride.map(Math.floor);
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

    public get offset () {
        return this._offset;
    }

    public set offset (offset: number) {
        this._offset = Math.floor(offset);
    }

    public get order () {
        return this._order;
    }

    /**
     * Get a particular index of the NDArray
     * @param {number} indices
     * @returns {number}
     */
    public index (...indices: number[]): number {
        return this.offset + (this.stride ? this._stride.reduce((previous, stride, index) => {
                return previous += stride * Math.floor(indices[index]);
            }, 0) : 0);
    }

    /**
     * Get a particular value of the NDArray at an index
     * @param {...number} indices
     * @returns {T}
     */
    public get (...indices: number[]): T {
        let index = this.index.apply(this, indices);
        return index > -1 ? this.data[index] : null;
    }

    /**
     * Set a particular value of the NDArray at an index
     * @param {T} value
     * @param {...number} indices
     */
    public set (value, ...indices: number[]): void {
        let index = this.index.apply(this, indices);
        if (index > -1) {
            this.data[index] = value;
        }
    }

    /**
     * Creates a shifted view of the NDArray from the top-left
     * @param {...number} indices
     * @returns {NDArray}
     */
    public lo (...indices: number[]): NDArray<T> {
        let offset = this.offset,
            stride = this.stride,
            d = 0;
        return new NDArray(
            this.data,
            this.shape.map((shape, i) => {
                let index = indices[i];
                if (typeof index === 'number' && index >= 0) {
                    d = Math.floor(index);
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
     * @param {...number} indices
     * @returns {NDArray}
     */
    public hi (...indices: number[]): NDArray<T> {
        return new NDArray(
            this.data,
            this.shape.map((shape, i) => {
                let index = indices[i];
                return (typeof index !== 'number' || index < 0) ? shape : Math.floor(index);
            }),
            this.stride,
            this.offset
        );
    }

    /**
     * Alters the stride length by rescaling the NDArray
     * @param {...number} indices
     * @returns {NDArray}
     */
    public step (...indices: number[]): NDArray<T> {
        let shape = this._shape.slice(0),
            stride = this._stride.slice(0),
            offset = this.offset,
            ceil = Math.ceil;
        indices.forEach((index, idx) => {
            if (typeof index === 'number') {
                index = Math.floor(index);
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
     * @param {...number} axes
     * @returns {NDArray}
     */
    public transpose (...axes: number[]): NDArray<T> {
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
     * @param {...number} axes
     * @returns {NDArray}
     */
    public pick (...axes: number[]): NDArray<T> {
        let offset = this.offset,
            stride = this.stride,
            shape = this.shape,
            a = [],
            b = [],
            axis;
        shape.forEach((item, idx) => {
            axis = axes[idx];
            if (typeof axis === 'number' && axis >= 0) {
                offset = Math.floor(offset + stride[idx] * axis);
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
    public toJSON (): Object {
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
    public toString (): string {
        return this.data.toString();
    }

    /**
     * Returns the primitive representation
     * @returns {Array<number>}
     */
    public valueOf () {
        return this.data.valueOf();
    }
}

export default NDArray;
