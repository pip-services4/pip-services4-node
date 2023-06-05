"use strict";
/** @module build */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultFluentdFactory = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const FluentdLogger_1 = require("../log/FluentdLogger");
/**
 * Creates Fluentd components by their descriptors.
 *
 * @see [[FluentdLogger]]
 */
class DefaultFluentdFactory extends pip_services4_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultFluentdFactory.FluentdLoggerDescriptor, FluentdLogger_1.FluentdLogger);
    }
}
exports.DefaultFluentdFactory = DefaultFluentdFactory;
DefaultFluentdFactory.FluentdLoggerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "logger", "fluentd", "*", "1.0");
//# sourceMappingURL=DefaultFluentdFactory.js.map