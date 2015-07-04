import INDArray from './INDArray';

/**
 * NDArray - Largely borrowed from https://github.com/mikolalysenko/ndarray
 * but rewritten in ES6 and not string generated.
 *
 * Base class for Matrix/Vector
 */
export default class NDArray<T> implements INDArray<T> {
    public data: Array<T>;

    private _shape: Array<number>;
    private _stride: Array<number>;
    private _size: number;
    private _order: Array<number>;
    private _offset: number;

    constructor(data: T|Array<T> = [], shape?: Array<number>, stride?: Array<number>, offset?: number) {
        this.data = <Array<T>> (data instanceof Array ? data : [data]);
        this.shape = shape || (this.data ? [this.data.length] : []);
        // init stride to the product of shape lengths
        if (!stride) {
            stride = [];
            let i: number = this.shape.length,
                size: number = 1;
            while (i--) {
                stride[i] = size;
                size *= this.shape[i];
            }
        }
        this.stride = stride;
        // init offset correctly if negative stride
        if (!offset) {
            offset = this.shape.reduce((prev: number, shaped: number, idx: number) => {
                let strided: number = this._stride[idx];
                if (strided < 0) {
                    prev -= (shaped - 1) * strided;
                }
                return prev;
            }, 0);
        }
        this.offset = offset;
    }

    public get size(): number {
        return this._size;
    }

    public get shape(): Array<number> {
        return this._shape;
    }

    public set shape(shape: Array<number>) {
        if (!shape || !shape.length) {
            this._shape = [];
            this._size = 0;
        } else {
            this._shape = shape.map(Math.floor);
            this._size = this._shape.reduce((previous: number, shaped: number) =>
                previous *= shaped, 1);
        }
    }

    public get stride(): Array<number> {
        return this._stride;
    }

    public set stride(stride: Array<number>) {
        if (!stride || !stride.length) {
            this._stride = [];
            this._order = [];
        } else {
            this._stride = stride.map(Math.floor);
            this._order = this._stride
                .map((stride: number, index: number) => [Math.abs(stride), index])
                .sort((a: Array<number>, b: Array<number>) => a[0] - b[0])
                .map((term: Array<number>) => term[1]);
        }
    }

    public get offset(): number {
        return this._offset;
    }

    public set offset(offset: number) {
        this._offset = Math.floor(offset);
    }

    public get order(): Array<number> {
        return this._order;
    }

    /**
     * Get a particular index of the NDArray
     */
    public index(...indices: Array<number>): number {
        return this.offset +
            this._stride.reduce((previous: number, stride: number, index: number) =>
                previous += stride * Math.floor(indices[index]), 0);
    }

    /**
     * Get a particular value of the NDArray at an index
     */
    public get(...indices: Array<number>): T {
        return this.data[this.index.apply(this, indices)];
    }

    /**
     * Set a particular value of the NDArray at an index
     */
    public set(value: T, ...indices: Array<number>): void {
        this.data[this.index.apply(this, indices)] = value;
    }

    /**
     * Creates a shifted view of the NDArray from the top-left
     */
    public lo(...indices: Array<number>): NDArray<T> {
        let index: number ;
        return new NDArray(
            this.data,
            this.shape.map((shape: number, idx: number) => {
                index = Math.floor(indices[idx]);
                return index < 0 ?
                       shape :
                       shape - this.offset * this.stride[idx] * index;
            }),
            this.stride,
            this.offset
        );
    }

    /**
     * Creates a shifted view of the NDArray from the bottom right
     */
    public hi(...indices: Array<number>): NDArray<T> {
        let index: number;
        return new NDArray(
            this.data,
            this.shape.map((shape: number, idx: number) => {
                index = Math.floor(indices[idx]);
                return index < 0 ?
                       shape :
                       index;
            }),
            this.stride,
            this.offset
        );
    }

    /**
     * Alters the stride length by rescaling the NDArray
     */
    public step(...indices: Array<number>): NDArray<T> {
        let shape: Array<number> = this._shape.slice(),
            stride: Array<number> = this._stride.slice(),
            offset: number = this.offset;
        indices.forEach((index: number, idx: number) => {
            if (typeof index === 'number') {
                index = Math.floor(index);
                if (index < 0) {
                    offset += stride[index] * (shape[idx] - 1);
                    shape[idx] = Math.ceil(-shape[idx] / index);
                } else {
                    shape[idx] = Math.ceil(shape[idx] / index);
                }
                stride[idx] *= index;
            }
        });
        return new NDArray(this.data, shape, stride, this.offset);
    }

    /**
     * Transposes the indices in place of the NDArray
     */
    public transpose(...axes: Array<number>): NDArray<T> {
        let stride: Array<number> = [],
            shape: Array<number> = [],
            axis: number;
        this.shape.forEach((item: number, idx: number) => {
            axis = axes[idx] || idx;
            shape[idx] = stride[axis];
            stride[idx] = shape[axis];
        });
        return new NDArray(this.data, shape, stride, this.offset);
    }

    /**
     * Pull out a subarray from a given NDArray
     */
    public pick(...axes: Array<number>): NDArray<T> {
        let shape: Array<number> = [],
            stride: Array<number> = [],
            offset: number = 0,
            axis: number;
        this.shape.forEach((item: number, idx: number) => {
            axis = axes[idx];
            if (axis >= 0) {
                offset += Math.floor(stride[idx] * axis);
            } else {
                shape.push(shape[idx]);
                stride.push(stride[idx]);
            }
        });
        return new NDArray(this.data, shape, stride, offset);
    }

    /**
     * Returns the json representation
     */
    public toJSON(): Object {
        return {
            data: this.data,
            shape: this.shape,
            stride: this.stride,
            offset: this.offset
        };
    }

    /**
     * Returns the string representation
     */
    public toString(): string {
        return this.data.toString();
    }

    /**
     * Returns the primitive representation
     */
    public valueOf(): Object {
        return this.data.valueOf();
    }
}
