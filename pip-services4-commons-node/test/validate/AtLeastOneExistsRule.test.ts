const assert = require('chai').assert;

import { TestObject } from './TestObject';
import { TestSubObject } from './TestSubObject';
import { Schema } from '../../src/validate/Schema';
import { AtLeastOneExistsRule } from '../../src/validate/AtLeastOneExistsRule';

suite('AtLeastOneExistsRule', ()=> {

    test('Only One Exists Rule', () => {
        let obj = new TestObject();

        let schema = new Schema().withRule(new AtLeastOneExistsRule("missingProperty", "stringProperty", "nullProperty"));
        let results = schema.validate(obj);
        assert.equal(results.length, 0);

        schema = new Schema().withRule(new AtLeastOneExistsRule("stringProperty", "nullProperty", "intField"));
        results = schema.validate(obj);
        assert.equal(results.length, 0);

        schema = new Schema().withRule(new AtLeastOneExistsRule("missingProperty", "nullProperty"));
        results = schema.validate(obj);
        assert.equal(results.length, 1);
    });    

});
