import NDArray from './NDArray';
class NilNDArray extends NDArray {
    constructor(data = []) {
        super(data);
    }
}
export default NilNDArray;
