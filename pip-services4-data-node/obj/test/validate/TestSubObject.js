"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSubObject = void 0;
class TestSubObject {
    constructor(id) {
        this._nullProperty = null;
        this.floatField = 432.1;
        this.id = id;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get nullProperty() {
        return this._nullProperty;
    }
    set nullProperty(value) {
        this._nullProperty = value;
    }
}
exports.TestSubObject = TestSubObject;
//# sourceMappingURL=TestSubObject.js.map