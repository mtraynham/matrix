import NDArray from './NDArray';

/**
 * A Nil Dimensioned NDArray
 */
class NilNDArray<T> extends NDArray<T> {
    constructor(data: T|Array<T> = []) {
        super(data);
    }
}

export default NilNDArray;
