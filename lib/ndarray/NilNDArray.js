export class NilNDArray {
    constructor (data) {
        this.data = data;
    }
    get size () { return 0; }
    get dimension () { return -1; }
    get shape () { return []; }
    get stride () { return []; }
    get order () { return []; }
    index () { return -1; }
    lo () { return new NilNDArray(this.data); }
    hi () { return new NilNDArray(this.data); }
    transpose () { return new NilNDArray(this.data); }
    step () { return new NilNDArray(this.data); }
    get () {}
    set () {}
    pick () { return null; }
}
