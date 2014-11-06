import NDArray from './NDArray';

export class ZeroNDArray extends NDArray {
    constructor (data = [], offset = 0) {
        super(data, null, null, offset);
    }
    get size () { return 1; }
    get shape () { return []; }
    get stride () { return []; }
    get order () { return []; }
    get () { return this.data[this.offset]; }
    set (value) { return (this.data[this.offset] = value); }
        index () { return this.offset; }
    lo () { return new ZeroNDArray(this.data, this.offset); }
    hi () { return new ZeroNDArray(this.data, this.offset); }
    transpose () { return new ZeroNDArray(this.data, this.offset); }
    step () { return new ZeroNDArray(this.data, this.offset); }
    pick () { return new ZeroNDArray(this.data, 0); }
}