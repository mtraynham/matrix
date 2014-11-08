export class NumberUtils {
    /**
     * A bitwise floor
     * @param datum
     * @returns {number}
     */
    static bitwiseFloor (datum) {
        return datum | 0;
    }

    /**
     * Return the datum or value
     * @param datum
     * @param value
     * @returns {number}
     */
    static nullToValue (datum, value = 0) {
        return datum || value;
    }

    /**
     * Utility to return 0 or value
     * @param datum
     * @returns {number}
     */
    static nullToZero (datum) {
        return NumberUtils.nullToValue(datum);
    }
}
