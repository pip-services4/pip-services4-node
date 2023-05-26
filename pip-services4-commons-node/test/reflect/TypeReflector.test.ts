import chai = require('chai');
const assert = chai.assert;

import { TypeReflector } from '../../src/reflect/TypeReflector';

suite('TypeReflector', ()=> {

   test('Get Type', () => {
		const type = TypeReflector.getType("TestClass", __dirname + "/TestClass");
		assert.isNotNull(type);
   });

   test('Create Instance', () => {
		const value = TypeReflector.createInstance("TestClass", __dirname + "/TestClass", 123);
		assert.isNotNull(value);
   });

});
