"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCredentialStoreFactory = void 0;
/** @module auth */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const MemoryCredentialStore_1 = require("./MemoryCredentialStore");
/**
 * Creates [[ICredentialStore]] components by their descriptors.
 *
 * @see [[IFactory]]
 * @see [[ICredentialStore]]
 * @see [[MemoryCredentialStore]]
 */
class DefaultCredentialStoreFactory extends pip_services4_components_node_2.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultCredentialStoreFactory.MemoryCredentialStoreDescriptor, MemoryCredentialStore_1.MemoryCredentialStore);
    }
}
exports.DefaultCredentialStoreFactory = DefaultCredentialStoreFactory;
DefaultCredentialStoreFactory.MemoryCredentialStoreDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "credential-store", "memory", "*", "1.0");
//# sourceMappingURL=DefaultCredentialStoreFactory.js.map