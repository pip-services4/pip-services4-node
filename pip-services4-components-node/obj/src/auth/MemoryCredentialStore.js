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
exports.MemoryCredentialStore = void 0;
/** @module auth */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const CredentialParams_1 = require("./CredentialParams");
/**
 * Credential store that keeps credentials in memory.
 *
 * ### Configuration parameters ###
 *
 * - [credential key 1]:
 *     - ...                          credential parameters for key 1
 * - [credential key 2]:
 *     - ...                          credential parameters for key N
 * - ...
 *
 * @see [[ICredentialStore]]
 * @see [[CredentialParams]]
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *         "key1.user", "jdoe",
 *         "key1.pass", "pass123",
 *         "key2.user", "bsmith",
 *         "key2.pass", "mypass"
 *     );
 *
 *     let credentialStore = new MemoryCredentialStore();
 *     credentialStore.readCredentials(config);
 *
 *     let credential = await credentialStore.lookup("123", "key1");
 *     // Result: user=jdoe;pass=pass123
 */
class MemoryCredentialStore {
    /**
     * Creates a new instance of the credential store.
     *
     * @param config    (optional) configuration with credential parameters.
     */
    constructor(config = null) {
        this._items = new pip_services3_commons_node_1.StringValueMap();
        if (config != null) {
            this.configure(config);
        }
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this.readCredentials(config);
    }
    /**
     * Reads credentials from configuration parameters.
     * Each section represents an individual CredentialParams
     *
     * @param config   configuration parameters to be read
     */
    readCredentials(config) {
        this._items.clear();
        let sections = config.getSectionNames();
        for (let index = 0; index < sections.length; index++) {
            let section = sections[index];
            let value = config.getSection(section);
            this._items.append(CredentialParams_1.CredentialParams.fromTuples(section, value));
        }
    }
    /**
     * Stores credential parameters into the store.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the credential parameters.
     * @param credential        a credential parameters to be stored.
     */
    store(correlationId, key, credential) {
        return __awaiter(this, void 0, void 0, function* () {
            if (credential != null) {
                this._items[key] = credential;
            }
            else {
                delete this._items[key];
            }
        });
    }
    /**
     * Lookups credential parameters by its key.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param key               a key to uniquely identify the credential parameters.
     * @param callback          callback function that receives found credential parameters or error.
     */
    lookup(correlationId, key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this._items[key] === 'string' || this._items[key] instanceof String) {
                return CredentialParams_1.CredentialParams.fromString(this._items[key]);
            }
            return this._items[key];
        });
    }
}
exports.MemoryCredentialStore = MemoryCredentialStore;
//# sourceMappingURL=MemoryCredentialStore.js.map