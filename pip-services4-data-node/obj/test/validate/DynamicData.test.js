"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const ObjectSchema_1 = require("../../src/validate/ObjectSchema");
suite('DynamicData', () => {
    test('Validate dynamic data', () => {
        let dynamicString = '{ "string_field": "ABC", "date_field": "2019-01-01T11:30:00.00", "int_field": 123, "float_field": 123.456 }';
        let dynamicObject = JSON.parse(dynamicString);
        let schema = new ObjectSchema_1.ObjectSchema()
            .withRequiredProperty("string_field", pip_services4_commons_node_1.TypeCode.String)
            .withRequiredProperty("date_field", pip_services4_commons_node_1.TypeCode.DateTime)
            .withRequiredProperty("int_field", pip_services4_commons_node_1.TypeCode.Integer)
            .withRequiredProperty("float_field", pip_services4_commons_node_1.TypeCode.Float);
        let results = schema.validate(dynamicObject);
        assert.equal(results.length, 0);
    });
});
//# sourceMappingURL=DynamicData.test.js.map