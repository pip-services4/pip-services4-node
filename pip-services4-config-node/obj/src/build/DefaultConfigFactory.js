"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultConfigFactory = void 0;
/** @module auth */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const MemoryCredentialStore_1 = require("../auth/MemoryCredentialStore");
const MemoryConfigReader_1 = require("../config/MemoryConfigReader");
const JsonConfigReader_1 = require("../config/JsonConfigReader");
const YamlConfigReader_1 = require("../config/YamlConfigReader");
const MemoryDiscovery_1 = require("../connect/MemoryDiscovery");
/**
 * Creates [[ICredentialStore]] components by their descriptors.
 *
 * @see [[IFactory]]
 * @see [[ICredentialStore]]
 * @see [[MemoryCredentialStore]]
 */
class DefaultConfigFactory extends pip_services4_components_node_2.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultConfigFactory.MemoryCredentialStoreDescriptor, MemoryCredentialStore_1.MemoryCredentialStore);
        this.registerAsType(DefaultConfigFactory.MemoryConfigReaderDescriptor, MemoryConfigReader_1.MemoryConfigReader);
        this.registerAsType(DefaultConfigFactory.JsonConfigReaderDescriptor, JsonConfigReader_1.JsonConfigReader);
        this.registerAsType(DefaultConfigFactory.YamlConfigReaderDescriptor, YamlConfigReader_1.YamlConfigReader);
        this.registerAsType(DefaultConfigFactory.MemoryDiscoveryDescriptor, MemoryDiscovery_1.MemoryDiscovery);
    }
}
exports.DefaultConfigFactory = DefaultConfigFactory;
DefaultConfigFactory.MemoryCredentialStoreDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "credential-store", "memory", "*", "1.0");
DefaultConfigFactory.MemoryConfigReaderDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "config-reader", "memory", "*", "1.0");
DefaultConfigFactory.JsonConfigReaderDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "config-reader", "json", "*", "1.0");
DefaultConfigFactory.YamlConfigReaderDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "config-reader", "yaml", "*", "1.0");
DefaultConfigFactory.MemoryDiscoveryDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "discovery", "memory", "*", "1.0");
//# sourceMappingURL=DefaultConfigFactory.js.map