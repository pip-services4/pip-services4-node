import chai = require('chai');
const assert = chai.assert;

import { TypeDescriptor } from '../../src/reflect/TypeDescriptor';

suite('TypeDescriptor', ()=> {

   test('From String', () => {
		let descriptor = TypeDescriptor.fromString(null);
		assert.isNull(descriptor);
		
		descriptor = TypeDescriptor.fromString("xxx,yyy");
		assert.equal("xxx", descriptor.getName());
		assert.equal("yyy", descriptor.getLibrary());

		descriptor = TypeDescriptor.fromString("xxx");
		assert.equal("xxx", descriptor.getName());
		assert.isNull(descriptor.getLibrary());

		try {
			descriptor = TypeDescriptor.fromString("xxx,yyy,zzz");
			assert.fail("Wrong descriptor shall raise an exception");
		} catch (ex) {
			// Ok...
		}
   });

   test('Equals', () => {
		const descriptor1 = TypeDescriptor.fromString("xxx,yyy");
		const descriptor2 = TypeDescriptor.fromString("xxx,yyy");
		assert.isTrue(descriptor1.equals(descriptor2));
	});

});
