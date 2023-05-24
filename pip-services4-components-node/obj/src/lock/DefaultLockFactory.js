"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLockFactory = void 0;
/** @module lock */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const NullLock_1 = require("./NullLock");
const MemoryLock_1 = require("./MemoryLock");
const Factory_1 = require("../build/Factory");
/**
 * Creates [[ILock]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[ILock]]
 * @see [[MemoryLock]]
 * @see [[NullLock]]
 */
class DefaultLockFactory extends Factory_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultLockFactory.NullLockDescriptor, NullLock_1.NullLock);
        this.registerAsType(DefaultLockFactory.MemoryLockDescriptor, MemoryLock_1.MemoryLock);
    }
}
exports.DefaultLockFactory = DefaultLockFactory;
DefaultLockFactory.NullLockDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "lock", "null", "*", "1.0");
DefaultLockFactory.MemoryLockDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "lock", "memory", "*", "1.0");
//# sourceMappingURL=DefaultLockFactory.js.map