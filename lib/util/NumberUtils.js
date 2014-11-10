export class NumberUtils {
    /**
     * A bitwise floor
     * @param {Number} datum
     * @returns {Number}
     */
    static bitwiseFloor (datum) {
        return datum | 0;
    }

    /**
     * Return the datum or value
     * @param {Number} datum
     * @param {Number} value
     * @returns {Number}
     */
    static nullToValue (datum, value = 0) {
        return datum || value;
    }

    /**
     * Utility to return 0 or value
     * @param {Number} datum
     * @returns {Number}
     */
    static nullToZero (datum) {
        return NumberUtils.nullToValue(datum);
    }
}
