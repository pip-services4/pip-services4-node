"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultConfigReaderFactory = void 0;
/** @module config */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const MemoryConfigReader_1 = require("./MemoryConfigReader");
const JsonConfigReader_1 = require("./JsonConfigReader");
const YamlConfigReader_1 = require("./YamlConfigReader");
/**
 * Creates [[IConfigReader]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[MemoryConfigReader]]
 * @see [[JsonConfigReader]]
 * @see [[YamlConfigReader]]
 */
class DefaultConfigReaderFactory extends pip_services4_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultConfigReaderFactory.MemoryConfigReaderDescriptor, MemoryConfigReader_1.MemoryConfigReader);
        this.registerAsType(DefaultConfigReaderFactory.JsonConfigReaderDescriptor, JsonConfigReader_1.JsonConfigReader);
        this.registerAsType(DefaultConfigReaderFactory.YamlConfigReaderDescriptor, YamlConfigReader_1.YamlConfigReader);
    }
}
exports.DefaultConfigReaderFactory = DefaultConfigReaderFactory;
DefaultConfigReaderFactory.MemoryConfigReaderDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "config-reader", "memory", "*", "1.0");
DefaultConfigReaderFactory.JsonConfigReaderDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "config-reader", "json", "*", "1.0");
DefaultConfigReaderFactory.YamlConfigReaderDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "config-reader", "yaml", "*", "1.0");
//# sourceMappingURL=DefaultConfigReaderFactory.js.map