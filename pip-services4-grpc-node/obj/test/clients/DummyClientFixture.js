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
exports.DummyClientFixture = void 0;
const assert = require('chai').assert;
const pip_services4_data_node_1 = require("pip-services4-data-node");
class DummyClientFixture {
    constructor(client) {
        this._client = client;
    }
    testCrudOperations() {
        return __awaiter(this, void 0, void 0, function* () {
            let dummy1 = { id: null, key: "Key 1", content: "Content 1" };
            let dummy2 = { id: null, key: "Key 2", content: "Content 2" };
            // Create one dummy
            let dummy = yield this._client.createDummy(null, dummy1);
            assert.isObject(dummy);
            assert.equal(dummy.content, dummy1.content);
            assert.equal(dummy.key, dummy1.key);
            dummy1 = dummy;
            // Create another dummy
            dummy = yield this._client.createDummy(null, dummy2);
            assert.isObject(dummy);
            assert.equal(dummy.content, dummy2.content);
            assert.equal(dummy.key, dummy2.key);
            dummy2 = dummy;
            // Get all dummies
            let dummies = yield this._client.getDummies(null, new pip_services4_data_node_1.FilterParams(), new pip_services4_data_node_1.PagingParams(0, 5, false));
            assert.isObject(dummies);
            assert.isTrue(dummies.data.length >= 2);
            // Update the dummy
            dummy1.content = 'Updated Content 1';
            dummy = yield this._client.updateDummy(null, dummy1);
            assert.isObject(dummy);
            assert.equal(dummy.content, 'Updated Content 1');
            assert.equal(dummy.key, dummy1.key);
            dummy1 = dummy;
            // Delete dummy
            yield this._client.deleteDummy(null, dummy1.id);
            // Try to get delete dummy
            dummy = yield this._client.getDummyById(null, dummy1.id);
            assert.isNull(dummy || null);
        });
    }
}
exports.DummyClientFixture = DummyClientFixture;
//# sourceMappingURL=DummyClientFixture.js.map