import NDArray from './NDArray';
export class ZeroNDArray extends NDArray {
    constructor(data, offset = 0) {
        super(data, null, null, offset);
    }
}
