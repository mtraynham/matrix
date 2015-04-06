class NDArray {
    constructor(data = [], shape, stride, offset) {
        this.data = (data instanceof Array ? data : [data]);
        this.shape = shape || (this.data ? [this.data.length] : []);
        if (!stride) {
            stride = [];
            let i = this.shape.length, size = 1;
            while (i--) {
                stride[i] = size;
                size *= this.shape[i];
            }
        }
        this.stride = stride;
        if (!offset) {
            offset = this.shape.reduce((prev, shaped, idx) => {
                let strided = this._stride[idx];
                if (strided < 0) {
                    prev -= (shaped - 1) * strided;
                }
                return prev;
            }, 0);
        }
        this.offset = offset;
    }
    get size() {
        return this._size;
    }
    get shape() {
        return this._shape;
    }
    set shape(shape) {
        if (!shape || !shape.length) {
            this._shape = [];
            this._size = 0;
        }
        else {
            this._shape = shape.map(Math.floor);
            this._size = this._shape.reduce((previous, shaped) => previous *= shaped, 1);
        }
    }
    get stride() {
        return this._stride;
    }
    set stride(stride) {
        if (!stride || !stride.length) {
            this._stride = [];
            this._order = [];
        }
        else {
            this._stride = stride.map(Math.floor);
            this._order = this._stride
                .map((stride, index) => [Math.abs(stride), index])
                .sort((a, b) => a[0] - b[0])
                .map((term) => term[1]);
        }
    }
    get offset() {
        return this._offset;
    }
    set offset(offset) {
        this._offset = Math.floor(offset);
    }
    get order() {
        return this._order;
    }
    index(...indices) {
        return this.offset +
            this._stride.reduce((previous, stride, index) => previous += stride * Math.floor(indices[index]), 0);
    }
    get(...indices) {
        let index = this.index.apply(this, indices);
        return index > -1 ? this.data[index] : null;
    }
    set(value, ...indices) {
        let index = this.index.apply(this, indices);
        if (index > -1) {
            this.data[index] = value;
        }
    }
    lo(...indices) {
        let index;
        return new NDArray(this.data, this.shape.map((shape, idx) => {
            index = Math.floor(indices[idx]);
            return index < 0 ?
                shape :
                shape - this.offset * this.stride[idx] * index;
        }), this.stride, this.offset);
    }
    hi(...indices) {
        let index;
        return new NDArray(this.data, this.shape.map((shape, idx) => {
            index = Math.floor(indices[idx]);
            return index < 0 ?
                shape :
                index;
        }), this.stride, this.offset);
    }
    step(...indices) {
        let shape = this._shape.slice(), stride = this._stride.slice(), offset = this.offset;
        indices.forEach((index, idx) => {
            if (typeof index === 'number') {
                index = Math.floor(index);
                if (index < 0) {
                    offset += stride[index] * (shape[idx] - 1);
                    shape[idx] = Math.ceil(-shape[idx] / index);
                }
                else {
                    shape[idx] = Math.ceil(shape[idx] / index);
                }
                stride[idx] *= index;
            }
        });
        return new NDArray(this.data, shape, stride, this.offset);
    }
    transpose(...axes) {
        let stride = [], shape = [], axis;
        this.shape.forEach((item, idx) => {
            axis = axes[idx] || idx;
            shape[idx] = stride[axis];
            stride[idx] = shape[axis];
        });
        return new NDArray(this.data, shape, stride, this.offset);
    }
    pick(...axes) {
        let shape = [], stride = [], offset = 0, axis;
        this.shape.forEach((item, idx) => {
            axis = axes[idx];
            if (axis >= 0) {
                offset += Math.floor(stride[idx] * axis);
            }
            else {
                shape.push(shape[idx]);
                stride.push(stride[idx]);
            }
        });
        return new NDArray(this.data, shape, stride, offset);
    }
    toJSON() {
        return {
            data: this.data,
            shape: this.shape,
            stride: this.stride,
            offset: this.offset
        };
    }
    toString() {
        return this.data.toString();
    }
    valueOf() {
        return this.data.valueOf();
    }
}
export default NDArray;
