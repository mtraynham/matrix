class ArrayUtils {

    /**
     * Fill an array using a function
     * @static
     * @param {Array.<T>} array
     * @param {Function(value: T, filler: T)} fn
     * @returns {Array.<T>}
     */
    public static fill <T>(array: Array<T>, filler: (value: T, index: Number) => T): Array<T> {
        let i: number = array.length;
        while (i--) {
            array[i] = filler(array[i], i);
        }
        return array;
    }

    /**
     * Fill undefined array data values
     * @static
     * @param {Array.<T>} array
     * @param {T} filler
     * @returns {Array.<T>}
     */
    public static fillEmpty <T>(array: Array<T>, filler: T): Array<T> {
        return ArrayUtils.fill(array, (value: T) => value || filler);
    }

    /**
     * Fill array with a single value
     * @static
     * @param {Array.<T>} array
     * @param {T} value
     * @returns {Array.<T>}
     */
    public static fillValue <T>(array: Array<T>, filler: T): Array<T> {
        return ArrayUtils.fill(array, () => filler);
    }

    /**
     * Fill an array full of zeroes
     * @static
     * @param {Array.<T>} array
     * @returns {Array.<T>}
     */
    public static fillZero (array: Array<number>): Array<number> {
        return ArrayUtils.fillValue(array, 0);
    }

    /**
     * Fill an array full of ones
     * @static
     * @param {Array.<T>} array
     * @returns {Array.<T>}
     */
    public static fillOnes (array: Array<number>): Array<number> {
        return ArrayUtils.fillValue(array, 1);
    }

    /**
     * Fill an array with the set of integers starting from 0 to array length
     * @static
     * @param {Array.<T>} array
     * @returns {Array.<T>}
     */
    public static fillIota (array: Array<number>): Array<number> {
        return ArrayUtils.fill(array, (value: number, index: number) => index);
    }

    /**
     * Fill the diagonal indices of an array
     * @static
     * @param {Array.<T>} array
     * @param {Number} dimensions
     * @param {T} diagonal
     * @param {T} nonDiagonal
     * @returns {*}
     */
    public static fillDiagonal <T>(array: Array<T>, diagonal: T, nonDiagonal: T, dimensions: number = 2): Array<T> {
        return ArrayUtils.fill(array, (value: T, index: number) => {
            return Math.floor(dimensions / index) === dimensions % index ? diagonal : nonDiagonal;
        });
    }
}

export default ArrayUtils;
