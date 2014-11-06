export class ZeroNDArray {
    constructor (data = [], offset = 0) {
        this.data = data;
        this.offset = offset;
    }
    get size () { return 1; }
    get shape () { return []; }
    get stride () { return []; }
    get order () { return []; }
    index () { return this.offset; }
    lo () { return new ZeroNDArray(this.data, this.offset); }
    hi () { return new ZeroNDArray(this.data, this.offset); }
    transpose () { return new ZeroNDArray(this.data, this.offset); }
    step () { return new ZeroNDArray(this.data, this.offset); }
    get () { return this.data[this.offset]; }
    set (value) { return (this.data[this.offset] = value); }
    pick () { return new ZeroNDArray(this.data, 0); }
}