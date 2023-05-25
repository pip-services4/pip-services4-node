const assert = require('chai').assert;

import { TestObject } from './TestObject';
import { Schema } from '../../src/validate/Schema';
import { OnlyOneExistsRule } from '../../src/validate/OnlyOneExistsRule';

suite('OnlyOneExistsRule', ()=> {

    test('OnlyOneExistsRule', () => {
        let obj = new TestObject();

        let schema = new Schema().withRule(new OnlyOneExistsRule("missingProperty", "stringProperty", "nullProperty"));
        let results = schema.validate(obj);
        assert.equal(results.length, 0);

        schema = new Schema().withRule(new OnlyOneExistsRule("stringProperty", "nullProperty", "intField"));
        results = schema.validate(obj);
        assert.equal(results.length, 1);
    });    

});
