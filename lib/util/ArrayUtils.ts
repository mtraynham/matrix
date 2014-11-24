export class ArrayUtils {

    /**
     * Fill an array using a function
     * @static
     * @param {Array.<T>} array
     * @param {Function(value: T, filler: T)} fn
     * @returns {Array.<T>}
     */
    public static fill <T>(array: Array<T>, filler: Function = (value: T, index: Number) => value) {
        var i = array.length;
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
    public static fillNull <T>(array: Array<T>, filler: T = 0) {
        return ArrayUtils.fill(array, (value) => value || filler);
    }

    /**
     * Fill array with a single value
     * @static
     * @param {Array.<T>} array
     * @param {T} value
     * @returns {Array.<T>}
     */
    public static fillValue <T>(array: Array<T>, filler: T) {
        return ArrayUtils.fill(array, () => filler);
    }

    /**
     * Fill an array full of zeroes
     * @static
     * @param {Array.<T>} array
     * @returns {Array.<T>}
     */
    public static fillZero <T>(array: Array<T>) {
        return ArrayUtils.fillValue(array, 0);
    }

    /**
     * Fill an array full of ones
     * @static
     * @param {Array.<T>} array
     * @returns {Array.<T>}
     */
    public static fillOnes <T>(array: Array<T>) {
        return ArrayUtils.fillValue(array, 1);
    }

    /**
     * Fill an array with the set of integers starting from 0 to array length
     * @static
     * @param {Array.<T>} array
     * @returns {Array.<T>}
     */
    public static fillIota <T>(array: Array<T>) {
        return ArrayUtils.fill(array, (value, index) => index);
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
    public static fillDiagonal <T>(array: Array<T>, dimensions:Number = 2, diagonal:Number = 1, nonDiagonal:Number = 0) {
        return ArrayUtils.fill(array, (value, index) => {
            return Math.floor(dimensions / index) === dimensions % index ? diagonal : nonDiagonal;
        });
    }
}
