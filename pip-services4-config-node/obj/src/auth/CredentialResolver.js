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
exports.CredentialResolver = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const CredentialParams_1 = require("./CredentialParams");
/**
 * Helper class to retrieve component credentials.
 *
 * If credentials are configured to be retrieved from [[ICredentialStore]],
 * it automatically locates [[ICredentialStore]] in component references
 * and retrieve credentials from there using store_key parameter.
 *
 * ### Configuration parameters ###
 *
 * __credential:__
 * - store_key:                   (optional) a key to retrieve the credentials from [[ICredentialStore]]
 * - ...                          other credential parameters
 *
 * __credentials:__                   alternative to credential
 * - [credential params 1]:       first credential parameters
 *     - ...                      credential parameters for key 1
 * - ...
 * - [credential params N]:       Nth credential parameters
 *     - ...                      credential parameters for key N
 *
 * ### References ###
 *
 * - <code>\*:credential-store:\*:\*:1.0</code>  (optional) Credential stores to resolve credentials
 *
 * @see [[CredentialParams]]
 * @see [[ICredentialStore]]
 *
 * ### Example ###
 *
 *     let config = ConfigParams.fromTuples(
 *         "credential.user", "jdoe",
 *         "credential.pass",  "pass123"
 *     );
 *
 *     let credentialResolver = new CredentialResolver();
 *     credentialResolver.configure(config);
 *     credentialResolver.setReferences(references);
 *
 *     let credential = credentialResolver.lookup("123");
 *     // Now use the credential...
 *
 */
class CredentialResolver {
    /**
     * Creates a new instance of credentials resolver.
     *
     * @param config        (optional) component configuration parameters
     * @param references    (optional) component references
     */
    constructor(config = null, references = null) {
        this._credentials = [];
        this._references = null;
        if (config != null) {
            this.configure(config);
        }
        if (references != null) {
            this.setReferences(references);
        }
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        const credentials = CredentialParams_1.CredentialParams.manyFromConfig(config);
        this._credentials.push(...credentials);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._references = references;
    }
    /**
     * Gets all credentials configured in component configuration.
     *
     * Redirect to CredentialStores is not done at this point.
     * If you need fully fleshed credential use [[lookup]] method instead.
     *
     * @returns a list with credential parameters
     */
    getAll() {
        return this._credentials;
    }
    /**
     * Adds a new credential to component credentials
     *
     * @param credential    new credential parameters to be added
     */
    add(credential) {
        this._credentials.push(credential);
    }
    lookupInStores(context, credential) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!credential.useCredentialStore()) {
                return credential;
            }
            const key = credential.getStoreKey();
            if (this._references == null) {
                return null;
            }
            const storeDescriptor = new pip_services4_components_node_2.Descriptor("*", "credential-store", "*", "*", "*");
            const stores = this._references.getOptional(storeDescriptor);
            if (stores.length == 0) {
                throw new pip_services4_components_node_1.ReferenceException(context, storeDescriptor);
            }
            for (const store of stores) {
                const result = yield store.lookup(context, key);
                if (result != null) {
                    return result;
                }
            }
            return null;
        });
    }
    /**
     * Looks up component credential parameters. If credentials are configured to be retrieved
     * from Credential store it finds a [[ICredentialStore]] and lookups credentials there.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @returns 			    a looked up credential.
     */
    lookup(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._credentials.length == 0) {
                return null;
            }
            const lookupCredentials = [];
            for (const credential of this._credentials) {
                if (!credential.useCredentialStore()) {
                    return credential;
                }
                else {
                    lookupCredentials.push(credential);
                }
            }
            for (const credential of lookupCredentials) {
                const result = yield this.lookupInStores(context, credential);
                if (result != null) {
                    return result;
                }
            }
            return null;
        });
    }
}
exports.CredentialResolver = CredentialResolver;
//# sourceMappingURL=CredentialResolver.js.map