"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultStateStoreFactory = void 0;
/** @module state-store */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const Factory_1 = require("../build/Factory");
const NullStateStore_1 = require("./NullStateStore");
const MemoryStateStore_1 = require("./MemoryStateStore");
/**
 * Creates [[IStateStore]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[IStateStore]]
 * @see [[MemoryStateStore]]
 * @see [[NullStateStore]]
 */
class DefaultStateStoreFactory extends Factory_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultStateStoreFactory.MemoryStateStoreDescriptor, MemoryStateStore_1.MemoryStateStore);
        this.registerAsType(DefaultStateStoreFactory.NullStateStoreDescriptor, NullStateStore_1.NullStateStore);
    }
}
exports.DefaultStateStoreFactory = DefaultStateStoreFactory;
DefaultStateStoreFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "factory", "state-store", "default", "1.0");
DefaultStateStoreFactory.NullStateStoreDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "state-store", "null", "*", "1.0");
DefaultStateStoreFactory.MemoryStateStoreDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "state-store", "memory", "*", "1.0");
//# sourceMappingURL=DefaultStateStoreFactory.js.map