export class ArrayUtils {
    /**
     * Fill an array using a function
     * @param array
     * @param fn
     * @returns {Array}
     */
    static fill (array, fn = () => 0) {
        let i = array.length;
        while (i--) {
            array[i] = fn(i);
        }
        return array;
    }

    /**
     * Fill an array full of zeroes
     * @param array
     * @returns {Array}
     */
    static fillZero (array) {
        return ArrayUtils.fill(array);
    }

    /**
     * Fill an array full of ones
     * @param array
     * @returns {Array}
     */
    static fillOnes (array) {
        return ArrayUtils.fill(array, () => 1);
    }

    /**
     * Fill an array with the set of integers starting from 0 to array length
     * @param array
     * @returns {Array}
     */
    static fillIota (array) {
        return ArrayUtils.fill(array, (i) => i);
    }

    /**
     * Fill the diagonal indices of an array
     * @param array
     * @param ndim dimensions of the array
     * @param diagonal the diagonal value (1)
     * @param nondiagonal the non diagonal value (0)
     * @returns {*}
     */
    static fillDiagonal(array, ndim = 2, diagonal = 1, nondiagonal = 0) {
        return ArrayUtils.fill(array, (i) =>  Math.floor(ndim / i) === ndim % i ? diagonal : nondiagonal);
    }
}
