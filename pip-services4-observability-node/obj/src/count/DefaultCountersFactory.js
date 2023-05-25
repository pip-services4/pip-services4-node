"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCountersFactory = void 0;
/** @module count */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const NullCounters_1 = require("./NullCounters");
const LogCounters_1 = require("./LogCounters");
const CompositeCounters_1 = require("./CompositeCounters");
/**
 * Creates [[ICounters]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[NullCounters]]
 * @see [[LogCounters]]
 * @see [[CompositeCounters]]
 */
class DefaultCountersFactory extends pip_services4_components_node_2.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultCountersFactory.NullCountersDescriptor, NullCounters_1.NullCounters);
        this.registerAsType(DefaultCountersFactory.LogCountersDescriptor, LogCounters_1.LogCounters);
        this.registerAsType(DefaultCountersFactory.CompositeCountersDescriptor, CompositeCounters_1.CompositeCounters);
    }
}
exports.DefaultCountersFactory = DefaultCountersFactory;
DefaultCountersFactory.NullCountersDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "counters", "null", "*", "1.0");
DefaultCountersFactory.LogCountersDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "counters", "log", "*", "1.0");
DefaultCountersFactory.CompositeCountersDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "counters", "composite", "*", "1.0");
//# sourceMappingURL=DefaultCountersFactory.js.map