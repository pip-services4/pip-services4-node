import chai = require('chai');
const assert = chai.assert;

import { TestClass } from './TestClass';
import { MethodReflector } from '../../src/reflect/MethodReflector';

suite('MethodReflector', ()=> {

   test('Get Methods', () => {       
       const obj = new TestClass();
       const methods = MethodReflector.getMethodNames(obj);
       assert.equal(3, methods.length);

       const result = MethodReflector.invokeMethod(obj, "PUBLICMETHOD", 1, 2);
       assert.equal(3, result);
   });

    test('Has Methods', () => {
        const obj = new TestClass();

        const result = MethodReflector.hasMethod(obj, "publicMethod");
        assert.isTrue(result);
    });

});
