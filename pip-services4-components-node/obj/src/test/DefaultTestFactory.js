"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTestFactory = void 0;
/** @module test */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const Factory_1 = require("../build/Factory");
const Shutdown_1 = require("./Shutdown");
/**
 * Creates test components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[Shutdown]]
 */
class DefaultTestFactory extends Factory_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultTestFactory.ShutdownDescriptor, Shutdown_1.Shutdown);
    }
}
exports.DefaultTestFactory = DefaultTestFactory;
DefaultTestFactory.ShutdownDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "shutdown", "*", "*", "1.0");
//# sourceMappingURL=DefaultTestFactory.js.map