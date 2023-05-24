"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCredentialStoreFactory = exports.MemoryCredentialStore = exports.CredentialResolver = exports.CredentialParams = void 0;
/**
 * @module auth
 *
 * Todo: Rewrite this description
 *
 * @preferred
 * Contains credentials implementation.
 *
 * Credentials – passwords, logins, application keys, secrets. This information is usually linked
 * with connection parameters. Connection parameters separate from authentication, because auth.
 * is saved as a secret, and stored separately from configuration parameters (host name, ip
 * addresses). They need added security and protection, so they were separated.
 *
 * Credential parameters include various credentials.
 *
 * Interfaces and abstract classes for credential stores, which can save or retrieve various
 * credential parameters.
 */
var CredentialParams_1 = require("./CredentialParams");
Object.defineProperty(exports, "CredentialParams", { enumerable: true, get: function () { return CredentialParams_1.CredentialParams; } });
var CredentialResolver_1 = require("./CredentialResolver");
Object.defineProperty(exports, "CredentialResolver", { enumerable: true, get: function () { return CredentialResolver_1.CredentialResolver; } });
var MemoryCredentialStore_1 = require("./MemoryCredentialStore");
Object.defineProperty(exports, "MemoryCredentialStore", { enumerable: true, get: function () { return MemoryCredentialStore_1.MemoryCredentialStore; } });
var DefaultCredentialStoreFactory_1 = require("./DefaultCredentialStoreFactory");
Object.defineProperty(exports, "DefaultCredentialStoreFactory", { enumerable: true, get: function () { return DefaultCredentialStoreFactory_1.DefaultCredentialStoreFactory; } });
//# sourceMappingURL=index.js.map