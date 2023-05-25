const assert = require('chai').assert;

import { TypeCode } from 'pip-services4-commons-node';
import { ObjectSchema } from '../../src/validate/ObjectSchema';

suite('DynamicData', ()=> {

    test('Validate dynamic data', () => {
        let dynamicString = '{ "string_field": "ABC", "date_field": "2019-01-01T11:30:00.00", "int_field": 123, "float_field": 123.456 }';
        let dynamicObject = JSON.parse(dynamicString);

        let schema = new ObjectSchema()
            .withRequiredProperty("string_field", TypeCode.String)
            .withRequiredProperty("date_field", TypeCode.DateTime)
            .withRequiredProperty("int_field", TypeCode.Integer)
            .withRequiredProperty("float_field", TypeCode.Float);
        let results = schema.validate(dynamicObject);
        assert.equal(results.length, 0);
    });    

});
