import chai = require('chai');
const assert = chai.assert;

import { DateTimeConverter } from '../../src/convert/DateTimeConverter';

suite('DateTimeConverter', ()=> {

    // Todo: Add more tests with time and conversion of ISO datetime
    test('To DateTime', () => {
        assert.equal(null, DateTimeConverter.toNullableDateTime(null));
        assert.equal(new Date(1975, 3, 8).toString(), DateTimeConverter.toDateTimeWithDefault(null, new Date(1975, 3, 8)).toString());   
        assert.equal(new Date(1975, 3, 8).toString(), DateTimeConverter.toDateTime(new Date(1975, 3, 8)).toString());     
        assert.equal(new Date(123456).toString(), DateTimeConverter.toDateTime(123456).toString());
        assert.equal(new Date(1975, 3, 8).toString(), DateTimeConverter.toDateTime('1975/04/08').toString());
        assert.equal(null, DateTimeConverter.toNullableDateTime('XYZ'));
    });

});
