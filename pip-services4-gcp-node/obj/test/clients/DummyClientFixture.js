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
const waitPort = require('wait-port');
const child_process_1 = require("child_process");
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
class DummyClientFixture {
    constructor(client, functionName = null, port = null) {
        this._client = client;
        this.port = port;
        this.functionName = functionName;
    }
    startCloudServiceLocally() {
        return __awaiter(this, void 0, void 0, function* () {
            let ff = (0, child_process_1.exec)(`npx functions-framework --target=${this.functionName} --signature-type=http --port=${this.port} --source=test/services`);
            yield waitPort({ host: 'localhost', port: this.port });
            this.process = ff;
            yield new Promise((resolve, reject) => {
                setTimeout(resolve, 500);
            });
        });
    }
    stopCloudServiceLocally() {
        return __awaiter(this, void 0, void 0, function* () {
            this.process.kill();
            this.process = null;
            // Hack to close all sockets from functions-framework
            process['_getActiveHandles']().forEach(element => {
                if (element.constructor.name == 'Socket')
                    element.emit('close');
            });
        });
    }
    testCrudOperations() {
        return __awaiter(this, void 0, void 0, function* () {
            let dummy1 = { id: null, key: "Key 1", content: "Content 1" };
            let dummy2 = { id: null, key: "Key 2", content: "Content 2" };
            // Create one dummy
            const createdDummy1 = yield this._client.createDummy(null, dummy1);
            assert.isObject(createdDummy1);
            assert.equal(createdDummy1.content, dummy1.content);
            assert.equal(createdDummy1.key, dummy1.key);
            dummy1 = createdDummy1;
            // Create another dummy
            const createdDummy2 = yield this._client.createDummy(null, dummy2);
            assert.isObject(createdDummy2);
            assert.equal(createdDummy2.content, dummy2.content);
            assert.equal(createdDummy2.key, dummy2.key);
            dummy2 = createdDummy2;
            // Get all dummies
            const dummyDataPage = yield this._client.getDummies(null, new pip_services3_commons_node_1.FilterParams(), new pip_services3_commons_node_2.PagingParams(0, 5, false));
            assert.isObject(dummyDataPage);
            assert.isTrue(dummyDataPage.data.length >= 2);
            // Update the dummy
            dummy1.content = 'Updated Content 1';
            const updatedDummy1 = yield this._client.updateDummy(null, dummy1);
            assert.isObject(updatedDummy1);
            assert.equal(updatedDummy1.content, dummy1.content);
            assert.equal(updatedDummy1.key, dummy1.key);
            dummy1 = updatedDummy1;
            // Delete dummy
            yield this._client.deleteDummy(null, dummy1.id);
            // Try to get delete dummy
            const dummy = yield this._client.getDummyById(null, dummy1.id);
            assert.isNull(dummy || null);
        });
    }
}
exports.DummyClientFixture = DummyClientFixture;
//# sourceMappingURL=DummyClientFixture.js.map