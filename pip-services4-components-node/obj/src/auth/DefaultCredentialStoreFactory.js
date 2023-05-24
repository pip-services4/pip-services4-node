"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCredentialStoreFactory = void 0;
/** @module auth */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const Factory_1 = require("../build/Factory");
const MemoryCredentialStore_1 = require("./MemoryCredentialStore");
/**
 * Creates [[ICredentialStore]] components by their descriptors.
 *
 * @see [[IFactory]]
 * @see [[ICredentialStore]]
 * @see [[MemoryCredentialStore]]
 */
class DefaultCredentialStoreFactory extends Factory_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultCredentialStoreFactory.MemoryCredentialStoreDescriptor, MemoryCredentialStore_1.MemoryCredentialStore);
    }
}
exports.DefaultCredentialStoreFactory = DefaultCredentialStoreFactory;
DefaultCredentialStoreFactory.MemoryCredentialStoreDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "credential-store", "memory", "*", "1.0");
//# sourceMappingURL=DefaultCredentialStoreFactory.js.map