"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultDiscoveryFactory = void 0;
/** @module connect */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const Factory_1 = require("../build/Factory");
const MemoryDiscovery_1 = require("./MemoryDiscovery");
/**
 * Creates [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[IDiscovery]]
 * @see [[MemoryDiscovery]]
 */
class DefaultDiscoveryFactory extends Factory_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultDiscoveryFactory.MemoryDiscoveryDescriptor, MemoryDiscovery_1.MemoryDiscovery);
    }
}
exports.DefaultDiscoveryFactory = DefaultDiscoveryFactory;
DefaultDiscoveryFactory.MemoryDiscoveryDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "discovery", "memory", "*", "1.0");
//# sourceMappingURL=DefaultDiscoveryFactory.js.map