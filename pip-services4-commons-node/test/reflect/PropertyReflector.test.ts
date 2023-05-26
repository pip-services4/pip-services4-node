import chai = require('chai');
const assert = chai.assert;

import { TestClass } from './TestClass';
import { PropertyReflector } from '../../src/reflect/PropertyReflector';

suite('PropertyReflector', ()=> {

   test('Get Property', () => {       
		const obj = new TestClass();

		let value = PropertyReflector.getProperty(obj, "privateField");
		//assert.isNull(value);
		
		value = PropertyReflector.getProperty(obj, "publicField");
		assert.equal("ABC", value);
		
		value = PropertyReflector.getProperty(obj, "PublicProp");
		assert.isNotNull(value);
   });

   test('Get Properties', () => {       
		const obj = new TestClass();        
		const names = PropertyReflector.getPropertyNames(obj);
		//assert.equal(2, names.length);
		assert.isTrue(names.indexOf("publicField") >= 0);
		assert.isTrue(names.indexOf("publicProp") >= 0);
		
		const map = PropertyReflector.getProperties(obj);
		assert.isObject(map);
        assert.equal("ABC", map["publicField"]);
		assert.isNotNull(map["publicProp"]);
   });

});
