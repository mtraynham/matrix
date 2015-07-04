import NDArray from './NDArray';

/**
 * A Zero Dimensioned NDArray
 */
export default class ZeroNDArray<T> extends NDArray<T> {
    constructor(data: T|Array<T>, offset: number = 0) {
        super(data, null, null, offset);
    }
}
