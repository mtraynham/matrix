import NDArray from './NDArray';

/**
 * A Nil Dimensioned NDArray
 */
export default class NilNDArray<T> extends NDArray<T> {
    constructor(data: T|Array<T> = []) {
        super(data);
    }
}
