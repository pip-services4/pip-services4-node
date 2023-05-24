const assert = require('chai').assert;

import { ConfigParams } from '../../src/config/ConfigParams';
import { NameResolver } from '../../src/config/NameResolver';

suite('NameResolver', ()=> {

    test('Resolve Name', () => {
        let config = ConfigParams.fromTuples("id", "ABC");
        let name = NameResolver.resolve(config);
		assert.equal(name, 'ABC');

        config = ConfigParams.fromTuples("name", "ABC");
        name = NameResolver.resolve(config);
		assert.equal(name, 'ABC');
    });    

    test('Resolve Empty Name', () => {
        let config = ConfigParams.fromTuples();
        let name = NameResolver.resolve(config);
		assert.isNull(name);
    });    

});
