"use strict";
/** @module cache */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLogicFactory = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const NullCache_1 = require("../cache/NullCache");
const MemoryCache_1 = require("../cache/MemoryCache");
const NullLock_1 = require("../lock/NullLock");
const MemoryLock_1 = require("../lock/MemoryLock");
const NullStateStore_1 = require("../state/NullStateStore");
const MemoryStateStore_1 = require("../state/MemoryStateStore");
/**
 * Creates business logic components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[ICache]]
 * @see [[MemoryCache]]
 * @see [[NullCache]]
 */
class DefaultLogicFactory extends pip_services4_components_node_2.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultLogicFactory.MemoryCacheDescriptor, MemoryCache_1.MemoryCache);
        this.registerAsType(DefaultLogicFactory.NullCacheDescriptor, NullCache_1.NullCache);
        this.registerAsType(DefaultLogicFactory.NullLockDescriptor, NullLock_1.NullLock);
        this.registerAsType(DefaultLogicFactory.MemoryLockDescriptor, MemoryLock_1.MemoryLock);
        this.registerAsType(DefaultLogicFactory.MemoryStateStoreDescriptor, MemoryStateStore_1.MemoryStateStore);
        this.registerAsType(DefaultLogicFactory.NullStateStoreDescriptor, NullStateStore_1.NullStateStore);
    }
}
exports.DefaultLogicFactory = DefaultLogicFactory;
DefaultLogicFactory.Descriptor = new pip_services4_components_node_1.Descriptor("pip-services", "factory", "logic", "default", "1.0");
DefaultLogicFactory.NullCacheDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "cache", "null", "*", "1.0");
DefaultLogicFactory.MemoryCacheDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "cache", "memory", "*", "1.0");
DefaultLogicFactory.NullLockDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "lock", "null", "*", "1.0");
DefaultLogicFactory.MemoryLockDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "lock", "memory", "*", "1.0");
DefaultLogicFactory.NullStateStoreDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "state-store", "null", "*", "1.0");
DefaultLogicFactory.MemoryStateStoreDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "state-store", "memory", "*", "1.0");
//# sourceMappingURL=DefaultLogicFactory.js.map