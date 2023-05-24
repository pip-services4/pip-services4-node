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
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const CredentialResolver_1 = require("../../src/auth/CredentialResolver");
suite('CredentialResolver', () => {
    let RestConfig = pip_services3_commons_node_1.ConfigParams.fromTuples("credential.username", "Negrienko", "credential.password", "qwerty", "credential.access_key", "key", "credential.store_key", "store key");
    test('Configure', () => {
        let credentialResolver = new CredentialResolver_1.CredentialResolver(RestConfig);
        let configList = credentialResolver.getAll();
        assert.equal(configList[0].get("username"), "Negrienko");
        assert.equal(configList[0].get("password"), "qwerty");
        assert.equal(configList[0].get("access_key"), "key");
        assert.equal(configList[0].get("store_key"), "store key");
    });
    test('Lookup', () => __awaiter(void 0, void 0, void 0, function* () {
        let credentialResolver = new CredentialResolver_1.CredentialResolver();
        let credential = yield credentialResolver.lookup("correlationId");
        assert.isNull(credential);
        let RestConfigWithoutStoreKey = pip_services3_commons_node_1.ConfigParams.fromTuples("credential.username", "Negrienko", "credential.password", "qwerty", "credential.access_key", "key");
        credentialResolver = new CredentialResolver_1.CredentialResolver(RestConfigWithoutStoreKey);
        credential = yield credentialResolver.lookup("correlationId");
        assert.equal(credential.get("username"), "Negrienko");
        assert.equal(credential.get("password"), "qwerty");
        assert.equal(credential.get("access_key"), "key");
        assert.isNull(credential.get("store_key"));
        credentialResolver = new CredentialResolver_1.CredentialResolver(RestConfig);
        try {
            credential = yield credentialResolver.lookup("correlationId");
            assert.fail("Expected to fail");
        }
        catch (_a) {
            // Expected exception
        }
        credentialResolver = new CredentialResolver_1.CredentialResolver(RestConfig);
        credentialResolver.setReferences(new pip_services3_commons_node_2.References());
        try {
            credential = yield credentialResolver.lookup("correlationId");
            assert.fail("Expected to fail");
        }
        catch (_b) {
            // Expected exception
        }
    }));
});
//# sourceMappingURL=CredentialResolver.test.js.map