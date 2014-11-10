export class ArrayUtils {
    /**
     * Fill an array using a function
     * @static
     * @param {Array.<T>} array
     * @param {Function(T=, Number=)} fn
     * @returns {Array.<T>}
     */
    static fill (array, fn = () => 0) {
        let i = array.length;
        while (i--) {
            array[i] = fn(array[i], i);
        }
        return array;
    }

    /**
     * Fill undefined array data values
     * @static
     * @param {Array.<T>} array
     * @param {T} value
     * @returns {Array.<T>}
     */
    static fillNull (array, value = 0) {
        return ArrayUtils.fill(array, (item) => item || value);
    }

    /**
     * Fill array with a single value
     * @static
     * @param {Array.<T>} array
     * @param {T} value
     * @returns {Array.<T>}
     */
    static fillValue (array, value = 0) {
        return ArrayUtils.fill(array, () => value);
    }

    /**
     * Fill an array full of zeroes
     * @static
     * @param {Array.<T>} array
     * @returns {Array.<T>}
     */
    static fillZero (array) {
        return ArrayUtils.fillValue(array);
    }

    /**
     * Fill an array full of ones
     * @static
     * @param {Array.<T>} array
     * @returns {Array.<T>}
     */
    static fillOnes (array) {
        return ArrayUtils.fillValue(array, 1);
    }

    /**
     * Fill an array with the set of integers starting from 0 to array length
     * @static
     * @param {Array.<T>} array
     * @returns {Array.<T>}
     */
    static fillIota (array) {
        return ArrayUtils.fill(array, (item, i) => i);
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
    static fillDiagonal(array, dimensions = 2, diagonal = 1, nonDiagonal = 0) {
        return ArrayUtils.fill(array, (item, i) => {
            return Math.floor(dimensions / i) === dimensions % i ? diagonal : nonDiagonal;
        });
    }
}
