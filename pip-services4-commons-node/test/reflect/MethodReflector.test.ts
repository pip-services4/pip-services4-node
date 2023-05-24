const assert = require('chai').assert;

import { TestClass } from './TestClass';
import { MethodReflector } from '../../src/reflect/MethodReflector';

suite('MethodReflector', ()=> {

   test('Get Methods', () => {       
       let obj = new TestClass();
       let methods = MethodReflector.getMethodNames(obj);
       assert.equal(3, methods.length);

       let result = MethodReflector.invokeMethod(obj, "PUBLICMETHOD", 1, 2);
       assert.equal(3, result);
   });

    test('Has Methods', () => {
        let obj = new TestClass();

        let result = MethodReflector.hasMethod(obj, "publicMethod");
        assert.isTrue(result);
    });

});
