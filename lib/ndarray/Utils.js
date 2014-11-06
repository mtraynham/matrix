export class Utils {
    /**
     * Utility to return 0 or value
     * @param datum
     * @returns {number}
     */
    static nullToZero (datum) {
        return datum | 0;
    }

    static iota (length) {
        let x = new Array(length),
            i = 0;
        for (i; i < length; i++) {
            x[i] = i;
        }
        return x;
    }
}
