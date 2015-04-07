/**
 * An array utility class that works with any type of Array (std array, Float64Array, Buffer, etc.)
 * This does not create new arrays, it modifies existing ones.
 */
class Arrays {

    /**
     * Fill an array using a function
     */
    public static fill <T>(array: Array<T>, filler: (value: T, index: number) => T): Array<T> {
        let i: number = array.length;
        while (i--) {
            array[i] = filler(array[i], i);
        }
        return array;
    }

    /**
     * Fill undefined array data values
     */
    public static fillEmpty <T>(array: Array<T>, filler: T): Array<T> {
        return Arrays.fill(array, (value: T) => value || filler);
    }

    /**
     * Fill array with a single value
     */
    public static fillValue <T>(array: Array<T>, filler: T): Array<T> {
        return Arrays.fill(array, () => filler);
    }

    /**
     * Fill an array full of zeroes
     */
    public static fillZero (array: Array<number>): Array<number> {
        return Arrays.fillValue(array, 0);
    }

    /**
     * Fill an array full of ones
     */
    public static fillOnes (array: Array<number>): Array<number> {
        return Arrays.fillValue(array, 1);
    }

    /**
     * Fill an array with the set of integers starting from 0 to array length
     */
    public static fillIota (array: Array<number>): Array<number> {
        return Arrays.fill(array, (value: number, index: number) => index);
    }

    /**
     * Fill the diagonal indices of an array
     */
    public static fillDiagonal <T>(array: Array<T>, diagonal: T, nonDiagonal: T, dimensions: number = 1): Array<T> {
        return Arrays.fill(array, (value: T, index: number) => {
            return Math.floor(index / dimensions) === index % dimensions ? diagonal : nonDiagonal;
        });
    }
}

export default Arrays;
