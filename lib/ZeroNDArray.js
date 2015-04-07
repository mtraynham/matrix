import NDArray from './NDArray';
class ZeroNDArray extends NDArray {
    constructor(data, offset = 0) {
        super(data, null, null, offset);
    }
}
export default ZeroNDArray;
