class ArrayUtils {
    static fill(array, filler) {
        let i = array.length;
        while (i--) {
            array[i] = filler(array[i], i);
        }
        return array;
    }
    static fillEmpty(array, filler) {
        return ArrayUtils.fill(array, (value) => value || filler);
    }
    static fillValue(array, filler) {
        return ArrayUtils.fill(array, () => filler);
    }
    static fillZero(array) {
        return ArrayUtils.fillValue(array, 0);
    }
    static fillOnes(array) {
        return ArrayUtils.fillValue(array, 1);
    }
    static fillIota(array) {
        return ArrayUtils.fill(array, (value, index) => index);
    }
    static fillDiagonal(array, diagonal, nonDiagonal, dimensions = 2) {
        return ArrayUtils.fill(array, (value, index) => {
            return Math.floor(dimensions / index) === dimensions % index ? diagonal : nonDiagonal;
        });
    }
}
export default ArrayUtils;
