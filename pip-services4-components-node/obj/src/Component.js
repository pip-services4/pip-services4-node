"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const CompositeLogger_1 = require("./log/CompositeLogger");
const CompositeCounters_1 = require("./count/CompositeCounters");
const CompositeTracer_1 = require("./trace/CompositeTracer");
/**
 * Abstract component that supportes configurable dependencies, logging
 * and performance counters.
 *
 * ### Configuration parameters ###
 *
 * - __dependencies:__
 *     - [dependency name 1]: Dependency 1 locator (descriptor)
 *     - ...
 *     - [dependency name N]: Dependency N locator (descriptor)
 *
 * ### References ###
 *
 * - <code>\*:counters:\*:\*:1.0</code>     (optional) [[ICounters]] components to pass collected measurements
 * - <code>\*:logger:\*:\*:1.0</code>       (optional) [[ILogger]] components to pass log messages
 * - <code>\*:tracer:\*:\*:1.0</code>       (optional) [[ITracer]] components to trace executed operations
 * - ...                                    References must match configured dependencies.
 */
class Component {
    constructor() {
        this._dependencyResolver = new pip_services3_commons_node_1.DependencyResolver();
        this._logger = new CompositeLogger_1.CompositeLogger();
        this._counters = new CompositeCounters_1.CompositeCounters();
        this._tracer = new CompositeTracer_1.CompositeTracer();
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._dependencyResolver.configure(config);
        this._logger.configure(config);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._tracer.setReferences(references);
    }
}
exports.Component = Component;
//# sourceMappingURL=Component.js.map