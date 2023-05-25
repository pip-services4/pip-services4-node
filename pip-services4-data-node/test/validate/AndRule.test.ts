const assert = require('chai').assert;

import { TestObject } from './TestObject';
import { TestSubObject } from './TestSubObject';
import { Schema } from '../../src/validate/Schema';
import { AndRule } from '../../src/validate/AndRule';
import { AtLeastOneExistsRule } from '../../src/validate/AtLeastOneExistsRule';

suite('AndRule', ()=> {

    test('AndRule', () => {
        let obj = new TestObject();

        let schema = new Schema().withRule(new AndRule(new AtLeastOneExistsRule("missingProperty", "stringProperty", "nullProperty"), new AtLeastOneExistsRule("stringProperty", "nullProperty", "intField")));
        let results = schema.validate(obj);
        assert.equal(results.length, 0);

        schema = new Schema().withRule(new AndRule(new AtLeastOneExistsRule("missingProperty", "stringProperty", "nullProperty"), new AtLeastOneExistsRule("missingProperty", "nullProperty")));
        results = schema.validate(obj);
        assert.equal(results.length, 1);
    });    

});
