/**
 * Defines projection parameters with list if fields to include into query results.
 *
 * The parameters support two formats: dot format and nested format.
 *
 * The dot format is the standard way to define included fields and subfields using
 * dot object notation: <code>"field1,field2.field21,field2.field22.field221"</code>.
 *
 * As alternative the nested format offers a more compact representation:
 * <code>"field1,field2(field21,field22(field221))"</code>.
 *
 * ### Example ###
 *
 *     let filter = FilterParams.fromTuples("type", "Type1");
 *     let paging = new PagingParams(0, 100);
 *     let projection = ProjectionParams.fromString("field1,field2(field21,field22)")
 *
 *     myDataClient.getDataByFilter(filter, paging, projection, (err, page) => {...});
 *
 */
export declare class ProjectionParams extends Array<string> {
    /**
     * Creates a new instance of the projection parameters and assigns its value.
     *
     * @param value     (optional) values to initialize this object.
     */
    constructor(values?: any[]);
    /**
     * Gets a string representation of the object.
     * The result is a comma-separated list of projection fields
     * "field1,field2.field21,field2.field22.field221"
     *
     * @returns a string representation of the object.
     */
    toString(): string;
    private static parseValue;
    /**
     * Converts specified value into ProjectionParams.
     *
     * @param value     value to be converted
     * @returns         a newly created ProjectionParams.
     *
     * @see [[AnyValueArray.fromValue]]
     */
    static fromValue(value: any): ProjectionParams;
    /**
     * Parses comma-separated list of projection fields.
     *
     * @param values    one or more comma-separated lists of projection fields
     * @returns         a newly created ProjectionParams.
     */
    static fromString(...values: string[]): ProjectionParams;
}
