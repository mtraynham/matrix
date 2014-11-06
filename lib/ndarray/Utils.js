export class Utils {
    /**
     * Utility to return 0 or value
     * @param datum
     * @returns {number}
     */
    static nullToZero (datum) {
        return datum | 0;
    }
}
