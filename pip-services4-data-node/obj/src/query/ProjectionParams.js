"use strict";
/** @module data */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectionParams = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
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
class ProjectionParams extends Array {
    /**
     * Creates a new instance of the projection parameters and assigns its value.
     *
     * @param value     (optional) values to initialize this object.
     */
    constructor(values = null) {
        super();
        // Set the prototype explicitly.
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        this.__proto__ = ProjectionParams.prototype;
        if (values != null) {
            for (const value of values) {
                this.push("" + value);
            }
        }
    }
    /**
     * Gets a string representation of the object.
     * The result is a comma-separated list of projection fields
     * "field1,field2.field21,field2.field22.field221"
     *
     * @returns a string representation of the object.
     */
    toString() {
        let builder = "";
        for (let index = 0; index < this.length; index++) {
            if (index > 0) {
                builder += ',';
            }
            builder += this[index];
        }
        return builder;
    }
    static parseValue(prefix, result, value) {
        value = value.trim();
        let openBracket = 0;
        let openBracketIndex = -1;
        let closeBracketIndex = -1;
        let commaIndex = -1;
        let breakCycleRequired = false;
        for (let index = 0; index < value.length; index++) {
            switch (value[index]) {
                case '(':
                    if (openBracket == 0) {
                        openBracketIndex = index;
                    }
                    openBracket++;
                    break;
                case ')':
                    openBracket--;
                    if (openBracket == 0) {
                        closeBracketIndex = index;
                        if (openBracketIndex >= 0 && closeBracketIndex > 0) {
                            const previousPrefix = prefix;
                            if (prefix && prefix.length > 0) {
                                prefix = prefix + "." + value.substring(0, openBracketIndex);
                            }
                            else {
                                prefix = value.substring(0, openBracketIndex);
                            }
                            let subValue = value.substring(openBracketIndex + 1, closeBracketIndex);
                            this.parseValue(prefix, result, subValue);
                            subValue = value.substring(closeBracketIndex + 1);
                            this.parseValue(previousPrefix, result, subValue);
                            breakCycleRequired = true;
                        }
                    }
                    break;
                case ',':
                    if (openBracket == 0) {
                        commaIndex = index;
                        let subValue = value.substring(0, commaIndex);
                        if (subValue && subValue.length > 0) {
                            if (prefix && prefix.length > 0) {
                                result.push(prefix + "." + subValue);
                            }
                            else {
                                result.push(subValue);
                            }
                        }
                        subValue = value.substring(commaIndex + 1);
                        if (subValue && subValue.length > 0) {
                            this.parseValue(prefix, result, subValue);
                            breakCycleRequired = true;
                        }
                    }
                    break;
            }
            if (breakCycleRequired) {
                break;
            }
        }
        if (value && value.length > 0 && openBracketIndex == -1 && commaIndex == -1) {
            if (prefix && prefix.length > 0) {
                result.push(prefix + "." + value);
            }
            else {
                result.push(value);
            }
        }
    }
    /**
     * Converts specified value into ProjectionParams.
     *
     * @param value     value to be converted
     * @returns         a newly created ProjectionParams.
     *
     * @see [[AnyValueArray.fromValue]]
     */
    static fromValue(value) {
        if (!Array.isArray(value)) {
            value = pip_services4_commons_node_1.AnyValueArray.fromValue(value);
        }
        return new ProjectionParams(value);
    }
    /**
     * Parses comma-separated list of projection fields.
     *
     * @param values    one or more comma-separated lists of projection fields
     * @returns         a newly created ProjectionParams.
     */
    static fromString(...values) {
        const result = new ProjectionParams();
        for (const value of values) {
            this.parseValue("", result, value);
        }
        return result;
    }
}
exports.ProjectionParams = ProjectionParams;
//# sourceMappingURL=ProjectionParams.js.map