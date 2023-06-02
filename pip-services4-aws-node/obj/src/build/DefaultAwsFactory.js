"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultAwsFactory = void 0;
/** @module build */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const CloudWatchLogger_1 = require("../log/CloudWatchLogger");
const CloudWatchCounters_1 = require("../count/CloudWatchCounters");
/**
 * Creates AWS components by their descriptors.
 *
 * @see [[CloudWatchLogger]]
 * @see [[CloudWatchCounters]]
 */
class DefaultAwsFactory extends pip_services4_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultAwsFactory.CloudWatchLoggerDescriptor, CloudWatchLogger_1.CloudWatchLogger);
        this.registerAsType(DefaultAwsFactory.CloudWatchCountersDescriptor, CloudWatchCounters_1.CloudWatchCounters);
    }
}
exports.DefaultAwsFactory = DefaultAwsFactory;
DefaultAwsFactory.Descriptor = new pip_services4_components_node_1.Descriptor("pip-services", "factory", "aws", "default", "1.0");
DefaultAwsFactory.CloudWatchLoggerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "logger", "cloudwatch", "*", "1.0");
DefaultAwsFactory.CloudWatchCountersDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "counters", "cloudwatch", "*", "1.0");
//# sourceMappingURL=DefaultAwsFactory.js.map