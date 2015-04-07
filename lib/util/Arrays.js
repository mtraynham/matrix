class Arrays {
    static fill(array, filler) {
        let i = array.length;
        while (i--) {
            array[i] = filler(array[i], i);
        }
        return array;
    }
    static fillEmpty(array, filler) {
        return Arrays.fill(array, (value) => value || filler);
    }
    static fillValue(array, filler) {
        return Arrays.fill(array, () => filler);
    }
    static fillZero(array) {
        return Arrays.fillValue(array, 0);
    }
    static fillOnes(array) {
        return Arrays.fillValue(array, 1);
    }
    static fillIota(array) {
        return Arrays.fill(array, (value, index) => index);
    }
    static fillDiagonal(array, diagonal, nonDiagonal, dimensions = 1) {
        return Arrays.fill(array, (value, index) => {
            return Math.floor(index / dimensions) === index % dimensions ? diagonal : nonDiagonal;
        });
    }
}
export default Arrays;
