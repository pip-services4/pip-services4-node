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
const CredentialParams_1 = require("../../src/auth/CredentialParams");
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const src_1 = require("../../src");
suite('MemoryCredentialStore', () => {
    test('Lookup and store test', () => __awaiter(void 0, void 0, void 0, function* () {
        let config = pip_services3_commons_node_1.ConfigParams.fromTuples('key1.user', 'user1', 'key1.pass', 'pass1', 'key2.user', 'user2', 'key2.pass', 'pass2');
        let credentialStore = new src_1.MemoryCredentialStore();
        credentialStore.readCredentials(config);
        let cred1 = yield credentialStore.lookup('123', 'key1');
        let cred2 = yield credentialStore.lookup('123', 'key2');
        assert.equal(cred1.getUsername(), "user1");
        assert.equal(cred1.getPassword(), "pass1");
        assert.equal(cred2.getUsername(), "user2");
        assert.equal(cred2.getPassword(), "pass2");
        let credConfig = CredentialParams_1.CredentialParams.fromTuples('user', 'user3', 'pass', 'pass3', 'access_id', '123');
        yield credentialStore.store(null, 'key3', credConfig);
        let cred3 = yield credentialStore.lookup('123', 'key3');
        assert.equal(cred3.getUsername(), "user3");
        assert.equal(cred3.getPassword(), "pass3");
        assert.equal(cred3.getAccessId(), "123");
    }));
});
//# sourceMappingURL=MemoryCredentialStore.test.js.map