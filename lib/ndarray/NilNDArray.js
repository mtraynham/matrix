import NDArray from './NDArray';

export class NilNDArray extends NDArray {
    constructor (data = []) {
        super(data);
    }
    get size () { return 0; }
    get shape () { return []; }
    get stride () { return []; }
    get order () { return []; }
    get () {}
    set () {}
    index () { return -1; }
    lo () { return new NilNDArray(this.data); }
    hi () { return new NilNDArray(this.data); }
    transpose () { return new NilNDArray(this.data); }
    step () { return new NilNDArray(this.data); }
    pick () { return new NilNDArray(this.data); }
}
