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
exports.DummyPersistenceFixture = void 0;
const assert = require('chai').assert;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
class DummyPersistenceFixture {
    constructor(persistence) {
        this._dummy1 = { id: null, key: "Key 1", content: "Content 1" };
        this._dummy2 = { id: null, key: "Key 2", content: "Content 2" };
        this._persistence = persistence;
    }
    testCrudOperations() {
        return __awaiter(this, void 0, void 0, function* () {
            // Create one dummy
            let dummy1 = yield this._persistence.create(null, this._dummy1);
            assert.isNotNull(dummy1);
            assert.isNotNull(dummy1.id);
            assert.equal(this._dummy1.key, dummy1.key);
            assert.equal(this._dummy1.content, dummy1.content);
            // Create another dummy
            let dummy2 = yield this._persistence.create(null, this._dummy2);
            assert.isNotNull(dummy2);
            assert.isNotNull(dummy2.id);
            assert.equal(this._dummy2.key, dummy2.key);
            assert.equal(this._dummy2.content, dummy2.content);
            let page = yield this._persistence.getPageByFilter(null, null, null);
            assert.isNotNull(page);
            assert.lengthOf(page.data, 2);
            // Update the dummy
            dummy1.content = "Updated Content 1";
            let result = yield this._persistence.update(null, dummy1);
            assert.isNotNull(result);
            assert.equal(dummy1.id, result.id);
            assert.equal(dummy1.key, result.key);
            assert.equal(dummy1.content, result.content);
            // Set the dummy
            dummy1.content = "Updated Content 2";
            result = yield this._persistence.set(null, dummy1);
            assert.isNotNull(result);
            assert.equal(dummy1.id, result.id);
            assert.equal(dummy1.key, result.key);
            assert.equal(dummy1.content, result.content);
            // Partially update the dummy
            result = yield this._persistence.updatePartially(null, dummy1.id, pip_services3_commons_node_1.AnyValueMap.fromTuples('content', 'Partially Updated Content 1'));
            assert.isNotNull(result);
            assert.equal(dummy1.id, result.id);
            assert.equal(dummy1.key, result.key);
            assert.equal('Partially Updated Content 1', result.content);
            // Get the dummy by Id
            result = yield this._persistence.getOneById(null, dummy1.id);
            // Try to get item
            assert.isNotNull(result);
            assert.equal(dummy1.id, result.id);
            assert.equal(dummy1.key, result.key);
            //assert.equal('Partially Updated Content 1', result.content);
            // Delete the dummy
            result = yield this._persistence.deleteById(null, dummy1.id);
            assert.isNotNull(result);
            assert.equal(dummy1.id, result.id);
            assert.equal(dummy1.key, result.key);
            //assert.equal('Partially Updated Content 1', result.content);
            // Get the deleted dummy
            result = yield this._persistence.getOneById(null, dummy1.id);
            // Try to get item
            assert.isNull(result);
            let count = yield this._persistence.getCountByFilter(null, null);
            assert.equal(count, 1);
        });
    }
    testBatchOperations() {
        return __awaiter(this, void 0, void 0, function* () {
            // Create one dummy
            let dummy1 = yield this._persistence.create(null, this._dummy1);
            assert.isNotNull(dummy1);
            assert.isNotNull(dummy1.id);
            assert.equal(this._dummy1.key, dummy1.key);
            assert.equal(this._dummy1.content, dummy1.content);
            // Create another dummy
            let dummy2 = yield this._persistence.create(null, this._dummy2);
            assert.isNotNull(dummy2);
            assert.isNotNull(dummy2.id);
            assert.equal(this._dummy2.key, dummy2.key);
            assert.equal(this._dummy2.content, dummy2.content);
            // Read batch
            let items = yield this._persistence.getListByIds(null, [dummy1.id, dummy2.id]);
            assert.isArray(items);
            assert.lengthOf(items, 2);
            // Delete batch
            yield this._persistence.deleteByIds(null, [dummy1.id, dummy2.id]);
            // Read empty batch
            items = yield this._persistence.getListByIds(null, [dummy1.id, dummy2.id]);
            assert.isArray(items);
            assert.lengthOf(items, 0);
        });
    }
}
exports.DummyPersistenceFixture = DummyPersistenceFixture;
//# sourceMappingURL=DummyPersistenceFixture.js.map