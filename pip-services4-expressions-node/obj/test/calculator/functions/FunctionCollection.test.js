"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const DelegatedFunction_1 = require("../../../src/calculator/functions/DelegatedFunction");
const FunctionCollection_1 = require("../../../src/calculator/functions/FunctionCollection");
const Variant_1 = require("../../../src/variants/Variant");
suite('FunctionCollection', () => {
    let testFunc = (stack, operations) => __awaiter(void 0, void 0, void 0, function* () {
        return new Variant_1.Variant("ABC");
    });
    test('AddRemoveFunctions', () => {
        let collection = new FunctionCollection_1.FunctionCollection();
        let func1 = new DelegatedFunction_1.DelegatedFunction("ABC", testFunc);
        collection.add(func1);
        assert.equal(1, collection.length);
        let func2 = new DelegatedFunction_1.DelegatedFunction("XYZ", testFunc);
        collection.add(func2);
        assert.equal(2, collection.length);
        let index = collection.findIndexByName("abc");
        assert.equal(0, index);
        let func = collection.findByName("Xyz");
        assert.equal(func2, func);
        collection.remove(0);
        assert.equal(1, collection.length);
        collection.removeByName("XYZ");
        assert.equal(0, collection.length);
    });
});
//# sourceMappingURL=FunctionCollection.test.js.map