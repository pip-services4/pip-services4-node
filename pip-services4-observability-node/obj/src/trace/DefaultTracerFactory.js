"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultTracerFactory = void 0;
/** @module trace */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const NullTracer_1 = require("./NullTracer");
const LogTracer_1 = require("./LogTracer");
const CompositeTracer_1 = require("./CompositeTracer");
/**
 * Creates [[ITracer]] components by their descriptors.
 *
 * @see [[Factory]]
 * @see [[NullTracer]]
 * @see [[ConsoleTracer]]
 * @see [[CompositeTracer]]
 */
class DefaultTracerFactory extends pip_services4_components_node_2.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultTracerFactory.NullTracerDescriptor, NullTracer_1.NullTracer);
        this.registerAsType(DefaultTracerFactory.LogTracerDescriptor, LogTracer_1.LogTracer);
        this.registerAsType(DefaultTracerFactory.CompositeTracerDescriptor, CompositeTracer_1.CompositeTracer);
    }
}
exports.DefaultTracerFactory = DefaultTracerFactory;
DefaultTracerFactory.NullTracerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "tracer", "null", "*", "1.0");
DefaultTracerFactory.LogTracerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "tracer", "log", "*", "1.0");
DefaultTracerFactory.CompositeTracerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "tracer", "composite", "*", "1.0");
//# sourceMappingURL=DefaultTracerFactory.js.map