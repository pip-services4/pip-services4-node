"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultLoggerFactory = void 0;
/** @module log */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const NullLogger_1 = require("./NullLogger");
const ConsoleLogger_1 = require("./ConsoleLogger");
const CompositeLogger_1 = require("./CompositeLogger");
const Factory_1 = require("../build/Factory");
/**
 * Creates [[ILogger]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[NullLogger]]
 * @see [[ConsoleLogger]]
 * @see [[CompositeLogger]]
 */
class DefaultLoggerFactory extends Factory_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultLoggerFactory.NullLoggerDescriptor, NullLogger_1.NullLogger);
        this.registerAsType(DefaultLoggerFactory.ConsoleLoggerDescriptor, ConsoleLogger_1.ConsoleLogger);
        this.registerAsType(DefaultLoggerFactory.CompositeLoggerDescriptor, CompositeLogger_1.CompositeLogger);
    }
}
exports.DefaultLoggerFactory = DefaultLoggerFactory;
DefaultLoggerFactory.NullLoggerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "logger", "null", "*", "1.0");
DefaultLoggerFactory.ConsoleLoggerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "logger", "console", "*", "1.0");
DefaultLoggerFactory.CompositeLoggerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "logger", "composite", "*", "1.0");
//# sourceMappingURL=DefaultLoggerFactory.js.map