import NDArray from './NDArray';

/**
 * A Zero Dimensioned NDArray
 */
export class ZeroNDArray<T> extends NDArray<T> {
    /**
     * Create an ZeroNDArray
     * @param {Array<T>} data
     * @param {number} offset
     */
    constructor (data: T|Array<T>, offset = 0) {
        super(data, null, null, offset);
    }
}
