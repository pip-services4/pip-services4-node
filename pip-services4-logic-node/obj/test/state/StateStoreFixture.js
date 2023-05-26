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
exports.StateStoreFixture = void 0;
const assert = require('chai').assert;
let KEY1 = "key1";
let KEY2 = "key2";
let VALUE1 = "value1";
let VALUE2 = "value2";
class StateStoreFixture {
    constructor(state) {
        this._state = null;
        this._state = state;
    }
    testSaveAndLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._state.save(null, KEY1, VALUE1);
            yield this._state.save(null, KEY2, VALUE2);
            let val = yield this._state.load(null, KEY1);
            assert.isNotNull(val);
            assert.equal(VALUE1, val);
            let values = yield this._state.loadBulk(null, [KEY2]);
            assert.lengthOf(values, 1);
            assert.equal(KEY2, values[0].key);
            assert.equal(VALUE2, values[0].value);
        });
    }
    testDelete() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._state.save(null, KEY1, VALUE1);
            yield this._state.delete(null, KEY1);
            let val = yield this._state.load(null, KEY1);
            assert.isNull(val || null);
        });
    }
}
exports.StateStoreFixture = StateStoreFixture;
//# sourceMappingURL=StateStoreFixture.js.map