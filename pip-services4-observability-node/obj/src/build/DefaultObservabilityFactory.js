"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultObservabilityFactory = void 0;
/** @module count */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const NullCounters_1 = require("../count/NullCounters");
const LogCounters_1 = require("../count/LogCounters");
const CompositeCounters_1 = require("../count/CompositeCounters");
const NullLogger_1 = require("../log/NullLogger");
const ConsoleLogger_1 = require("../log/ConsoleLogger");
const CompositeLogger_1 = require("../log/CompositeLogger");
const NullTracer_1 = require("../trace/NullTracer");
const LogTracer_1 = require("../trace/LogTracer");
const CompositeTracer_1 = require("../trace/CompositeTracer");
/**
 * Creates observability components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[NullCounters]]
 * @see [[LogCounters]]
 * @see [[CompositeCounters]]
 */
class DefaultObservabilityFactory extends pip_services4_components_node_2.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultObservabilityFactory.NullCountersDescriptor, NullCounters_1.NullCounters);
        this.registerAsType(DefaultObservabilityFactory.LogCountersDescriptor, LogCounters_1.LogCounters);
        this.registerAsType(DefaultObservabilityFactory.CompositeCountersDescriptor, CompositeCounters_1.CompositeCounters);
        this.registerAsType(DefaultObservabilityFactory.NullLoggerDescriptor, NullLogger_1.NullLogger);
        this.registerAsType(DefaultObservabilityFactory.ConsoleLoggerDescriptor, ConsoleLogger_1.ConsoleLogger);
        this.registerAsType(DefaultObservabilityFactory.CompositeLoggerDescriptor, CompositeLogger_1.CompositeLogger);
        this.registerAsType(DefaultObservabilityFactory.NullTracerDescriptor, NullTracer_1.NullTracer);
        this.registerAsType(DefaultObservabilityFactory.LogTracerDescriptor, LogTracer_1.LogTracer);
        this.registerAsType(DefaultObservabilityFactory.CompositeTracerDescriptor, CompositeTracer_1.CompositeTracer);
    }
}
exports.DefaultObservabilityFactory = DefaultObservabilityFactory;
DefaultObservabilityFactory.NullCountersDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "counters", "null", "*", "1.0");
DefaultObservabilityFactory.LogCountersDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "counters", "log", "*", "1.0");
DefaultObservabilityFactory.CompositeCountersDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "counters", "composite", "*", "1.0");
DefaultObservabilityFactory.NullLoggerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "logger", "null", "*", "1.0");
DefaultObservabilityFactory.ConsoleLoggerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "logger", "console", "*", "1.0");
DefaultObservabilityFactory.CompositeLoggerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "logger", "composite", "*", "1.0");
DefaultObservabilityFactory.NullTracerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "tracer", "null", "*", "1.0");
DefaultObservabilityFactory.LogTracerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "tracer", "log", "*", "1.0");
DefaultObservabilityFactory.CompositeTracerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "tracer", "composite", "*", "1.0");
//# sourceMappingURL=DefaultObservabilityFactory.js.map