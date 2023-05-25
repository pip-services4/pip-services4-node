"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestObject = void 0;
const TestSubObject_1 = require("./TestSubObject");
class TestObject {
    constructor() {
        this.privateField = 124;
        this.privateProperty = "XYZ";
        this.intField = 12345;
        this.stringProperty = "ABC";
        this.nullProperty = null;
        this.intArrayProperty = [1, 2, 3];
        this.stringListProperty = ["AAA", "BBB"];
        this.mapProperty = {};
        this.subObjectProperty = new TestSubObject_1.TestSubObject("1");
        this.subArrayProperty = [new TestSubObject_1.TestSubObject("2"), new TestSubObject_1.TestSubObject("3")];
        this.mapProperty["Key1"] = 111;
        this.mapProperty["Key2"] = 222;
    }
}
exports.TestObject = TestObject;
//# sourceMappingURL=TestObject.js.map