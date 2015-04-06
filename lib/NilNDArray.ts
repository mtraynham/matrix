import NDArray from './NDArray';

/**
 * A Nil Dimensioned NDArray
 */
export class NilNDArray<T> extends NDArray<T> {
    /**
     * Create an NilNDArray
     * @param {Array<T>|T} data
     */
    constructor (data: T|Array<T> = []) {
        super(data);
    }
}
