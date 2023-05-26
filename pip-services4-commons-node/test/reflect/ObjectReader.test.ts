import chai = require('chai');
const assert = chai.assert;

import { TestClass } from './TestClass';
import { ObjectReader } from '../../src/reflect/ObjectReader';

suite('ObjectReader', ()=> {

   test('Get Object Property', () => {       
		const obj = new TestClass();

		let value = ObjectReader.getProperty(obj, "privateField");
		//assert.isNull(value);
		
		value = ObjectReader.getProperty(obj, "publicField");
		assert.equal("ABC", value);
		
		value = ObjectReader.getProperty(obj, "PublicProp");
		assert.isNotNull(value);
   });

   test('Get Map Property', () => {       
		const map = {
			"key1": 123,
			"key2": "ABC"
        };

		let value = ObjectReader.getProperty(map, "key3");
		assert.isNull(value);
		
		value = ObjectReader.getProperty(map, "Key1");
		assert.equal(123, value);
		
		value = ObjectReader.getProperty(map, "KEY2");
		assert.equal("ABC", value);
   });

   test('Get Array Property', () => {       
        const list: any[] = [ 123, "ABC" ];

		let value = ObjectReader.getProperty(list, "3");
		assert.isNull(value);
		
		value = ObjectReader.getProperty(list, "0");
		assert.equal(123, value);
		
		value = ObjectReader.getProperty(list, "1");
		assert.equal("ABC", value);
   });

   test('Get Object Properties', () => {       
		const obj = new TestClass();
		const names = ObjectReader.getPropertyNames(obj);
		//assert.equal(2, names.length);
		assert.isTrue(names.indexOf("publicField") >= 0);
		assert.isTrue(names.indexOf("publicProp") >= 0);
		
		const map = ObjectReader.getProperties(obj);
		//assert.equals(2, map.length);
        assert.equal("ABC", map["publicField"]);
		assert.isNotNull(map["publicProp"]);
   });

   test('Get Map Properties', () => {       
		const map = {
			"key1": 123,
			"key2": "ABC"
        };
		const names = ObjectReader.getPropertyNames(map);
		assert.equal(2, names.length);
		assert.isTrue(names.indexOf("key1") >= 0);
		assert.isTrue(names.indexOf("key2") >= 0);
		
		const values = ObjectReader.getProperties(map);
		//assert.equal(2, values.lemgth);
		assert.equal(123, values["key1"]);
        assert.equal("ABC", values["key2"]);
   });

   test('Get Map Properties', () => {       
        const list = [ 123, "ABC" ];
		
		let names = ObjectReader.getPropertyNames(list);
		assert.equal(2, names.length);
		assert.isTrue(names.indexOf("0") >= 0);
		assert.isTrue(names.indexOf("1") >= 0);
		
		let values = ObjectReader.getProperties(list);
		//assert.equal(2, values.lenth);
        assert.equal(123, values["0"]);
        assert.equal("ABC", values["1"]);
		
        const array: any[] = [ 123, "ABC" ];

		names = ObjectReader.getPropertyNames(array);
		assert.equal(2, names.length);
		assert.isTrue(names.indexOf("0") >= 0);
		assert.isTrue(names.indexOf("1") >= 0);
		
		values = ObjectReader.getProperties(array);
		//assert.equal(2, values.length);
        assert.equal(123, values["0"]);
        assert.equal("ABC", values["1"]);
   });

});
