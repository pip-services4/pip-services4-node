"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const Variable_1 = require("../../../src/calculator/variables/Variable");
const VariableCollection_1 = require("../../../src/calculator/variables/VariableCollection");
suite('VariableCollection', () => {
    test('AddRemoveVariables', () => {
        let collection = new VariableCollection_1.VariableCollection();
        let var1 = new Variable_1.Variable("ABC");
        collection.add(var1);
        assert.equal(1, collection.length);
        let var2 = new Variable_1.Variable("XYZ");
        collection.add(var2);
        assert.equal(2, collection.length);
        let index = collection.findIndexByName("abc");
        assert.equal(0, index);
        let v = collection.findByName("Xyz");
        assert.equal(var2, v);
        let var3 = collection.locate("ghi");
        assert.isDefined(var3);
        assert.equal("ghi", var3.name);
        assert.equal(3, collection.length);
        collection.remove(0);
        assert.equal(2, collection.length);
        collection.removeByName("GHI");
        assert.equal(1, collection.length);
    });
});
//# sourceMappingURL=VariableCollection.test.js.map