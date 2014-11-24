export class NumberUtils {
    /**
     * A bitwise floor
     * @param {Number} datum
     * @returns {Number}
     */
    public static bitwiseFloor (datum: Number) {
        return datum | 0;
    }

    /**
     * Return the datum or value
     * @param {Number} datum
     * @param {Number} value
     * @returns {Number}
     */
    public static nullToValue (datum: Number, value: Number = 0) {
        return datum || value;
    }

    /**
     * Utility to return 0 or value
     * @param {Number} datum
     * @returns {Number}
     */
    public static nullToZero (datum: Number) {
        return NumberUtils.nullToValue(datum);
    }
}
