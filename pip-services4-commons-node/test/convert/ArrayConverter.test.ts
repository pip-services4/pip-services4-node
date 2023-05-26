import chai = require('chai');
const assert = chai.assert;

import { ArrayConverter } from '../../src/convert/ArrayConverter';

suite('ArrayConverter', ()=> {

    test('To Array', () => {
        let value = ArrayConverter.toArray(null);
        assert.isArray(value);
        assert.lengthOf(value, 0);
        
        value = ArrayConverter.toArray(123);
        assert.isArray(value);
        assert.lengthOf(value, 1);
        assert.equal(123, value[0]); 

        value = ArrayConverter.toArray([123]);
        assert.isArray(value);
        assert.lengthOf(value, 1);
        assert.equal(123, value[0]); 
 
        value = ArrayConverter.toArray('123');
        assert.isArray(value);
        assert.lengthOf(value, 1);
        assert.equal('123', value[0]); 

        value = ArrayConverter.listToArray('123,456');
        assert.isArray(value);
        assert.lengthOf(value, 2);
        assert.equal('123', value[0]); 
        assert.equal('456', value[1]); 

        value = ArrayConverter.toArray({ field1: "abc", field2: 123 });
        assert.isArray(value);
        assert.lengthOf(value, 2);
        assert.equal('abc', value[0]); 
        assert.equal(123, value[1]); 
   });

});
