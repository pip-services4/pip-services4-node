/**
 * Random generator for Date time values.
 *
 * ### Example ###
 *
 *     let value1 = RandomDateTime.nextDate(new Date(2010,0,1));    // Possible result: 2008-01-03
 *     let value2 = RandomDateTime.nextDateTime(new Date(2017,0.1));// Possible result: 2007-03-11 11:20:32
 *     let value3 = RandomDateTime.updateDateTime(new Date(2010,1,2));// Possible result: 2010-02-05 11:33:23
 */
export declare class RandomDateTime {
    /**
     * Generates a random Date in the range ['minYear', 'maxYear'].
     * This method generate dates without time (or time set to 00:00:00)
     *
     * @param min   (optional) minimum range value
     * @param max   max range value
     * @returns     a random Date value.
     */
    static nextDate(min: Date, max?: Date): Date;
    /**
     * Generates a random Date and time in the range ['minYear', 'maxYear'].
     * This method generate dates without time (or time set to 00:00:00)
     *
     * @param min   (optional) minimum range value
     * @param max   max range value
     * @returns     a random Date and time value.
     */
    static nextDateTime(min: Date, max?: Date): Date;
    /**
     * Updates (drifts) a Date value within specified range defined
     *
     * @param value     a Date value to drift.
     * @param range     (optional) a range in milliseconds. Default: 10 days
     */
    static updateDateTime(value: Date, range?: number): Date;
}
