const assert = require('chai').assert;

import { RandomBoolean } from '../../src/random/RandomBoolean';

suite('RandomBoolean', ()=> {

    test('Chance', () => {
        let value = RandomBoolean.chance(5, 10);
        assert.isTrue(value || !value); 
        
        value = RandomBoolean.chance(5, 5);
        assert.isTrue(value || !value); 
        
        value = RandomBoolean.chance(0, 0);
        assert.isTrue(!value); 
        
        value = RandomBoolean.chance(-1, 0);
        assert.isTrue(!value); 
        
        value = RandomBoolean.chance(-1, -1);
        assert.isTrue(!value); 
   });

});
