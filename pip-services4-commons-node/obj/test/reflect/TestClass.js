"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestClass = void 0;
/* eslint-disable @typescript-eslint/no-empty-function */
class TestClass {
    constructor() {
        this.privateField = 123;
        this.publicField = "ABC";
        this._publicProp = new Date();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    TestClass(arg1 = null) { }
    get privateProp() { return 543; }
    set privateProp(value) { }
    get publicProp() { return this._publicProp; }
    set publicProp(value) { this._publicProp = value; }
    privateMethod() { }
    publicMethod(arg1, arg2) {
        return arg1 + arg2;
    }
}
exports.TestClass = TestClass;
//# sourceMappingURL=TestClass.js.map