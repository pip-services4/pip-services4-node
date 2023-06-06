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
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_config_node_1 = require("pip-services4-config-node");
const VaultCredentialStore_1 = require("../../src/auth/VaultCredentialStore");
suite('VaultCredentialStore', () => {
    var _a, _b;
    let credentialStore;
    let host = (_a = process.env['VAULT_HOST']) !== null && _a !== void 0 ? _a : 'localhost';
    let port = (_b = process.env['VAULT_PORT']) !== null && _b !== void 0 ? _b : '8201';
    let vaultConfig = pip_services4_components_node_1.ConfigParams.fromTuples('connection.protocol', 'http', "connection.host", host, "connection.port", port, 'credential.auth_type', 'userpass', 'credential.username', 'user', 'credential.password', 'pass');
    let credentials = pip_services4_components_node_1.ConfigParams.fromTuples('credKey1.user', 'user1', 'credKey1.pass', 'pass1', 'credKey2.user', 'user2', 'credKey2.pass', 'pass2');
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        credentialStore = new VaultCredentialStore_1.VaultCredentialStore();
        credentialStore.configure(vaultConfig);
        yield credentialStore.open(null);
        yield credentialStore.loadVaultCredentials(credentials, true);
    }));
    test('Lookup and store test', () => __awaiter(void 0, void 0, void 0, function* () {
        const context = pip_services4_components_node_1.Context.fromTraceId('123');
        let cred1 = yield credentialStore.lookup(context, 'credKey1');
        let cred2 = yield credentialStore.lookup(context, 'credKey2');
        assert.equal(cred1.getUsername(), "user1");
        assert.equal(cred1.getPassword(), "pass1");
        assert.equal(cred2.getUsername(), "user2");
        assert.equal(cred2.getPassword(), "pass2");
        let credConfig = pip_services4_config_node_1.CredentialParams.fromTuples('user', 'user3', 'pass', 'pass3', 'access_id', '123');
        yield credentialStore.store(null, 'credKey3', credConfig);
        let cred3 = yield credentialStore.lookup(context, 'credKey3');
        assert.equal(cred3.getUsername(), "user3");
        assert.equal(cred3.getPassword(), "pass3");
        assert.equal(cred3.getAccessId(), "123");
        credConfig = pip_services4_config_node_1.CredentialParams.fromTuples('user', 'new_user', 'pass', 'new_pass', 'access_id', 'new_id');
        yield credentialStore.store(null, 'credKey1', credConfig);
        cred1 = yield credentialStore.lookup(context, 'credKey1');
        assert.equal(cred1.getUsername(), "new_user");
        assert.equal(cred1.getPassword(), "new_pass");
        assert.equal(cred1.getAccessId(), "new_id");
    }));
});
//# sourceMappingURL=VaultCredentialStore.test.js.map