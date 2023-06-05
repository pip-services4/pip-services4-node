"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataDogCounters = void 0;
/** @module count */
/** @hidden */
const os = require("os");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const DataDogMetricsClient_1 = require("../clients/DataDogMetricsClient");
const DataDogMetricType_1 = require("../clients/DataDogMetricType");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
/**
 * Performance counters that send their metrics to DataDog service.
 *
 * DataDog is a popular monitoring SaaS service. It collects logs, metrics, events
 * from infrastructure and applications and analyze them in a single place.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *     - protocol:            (optional) connection protocol: http or https (default: https)
 *     - host:                (optional) host name or IP address (default: api.datadoghq.com)
 *     - port:                (optional) port number (default: 443)
 *     - uri:                 (optional) resource URI or connection string with all parameters in it
 * - credential:
 *     - access_key:          DataDog client api key
 * - options:
 *   - retries:               number of retries (default: 3)
 *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] services to resolve connection
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-rpc-node/classes/services.restservice.html RestService]]
 * @see [[https://pip-services4-node.github.io/pip-services4-rpc-node/classes/services.commandablehttpservice.html CommandableHttpService]]
 *
 * ### Example ###
 *
 *     let counters = new DataDogCounters();
 *     counters.configure(ConfigParams.fromTuples(
 *         "credential.access_key", "827349874395872349875493"
 *     ));
 *
 *     await counters.open("123");
 *
 *     counters.increment("mycomponent.mymethod.calls");
 *     let timing = counters.beginTiming("mycomponent.mymethod.exec_time");
 *     try {
 *         ...
 *     } finally {
 *         timing.endTiming();
 *     }
 *
 *     counters.dump();
 */
class DataDogCounters extends pip_services4_observability_node_1.CachedCounters {
    /**
     * Creates a new instance of the performance counters.
     */
    constructor() {
        super();
        this._client = new DataDogMetricsClient_1.DataDogMetricsClient();
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        this._opened = false;
        this._instance = os.hostname();
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        super.configure(config);
        this._client.configure(config);
        this._source = config.getAsStringWithDefault("source", this._source);
        this._instance = config.getAsStringWithDefault("instance", this._instance);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._client.setReferences(references);
        const contextInfo = references.getOneOptional(new pip_services4_components_node_1.Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == null)
            this._source = contextInfo.name;
        if (contextInfo != null && this._instance == null)
            this._instance = contextInfo.contextId;
    }
    /**
     * Checks if the component is opened.
     *
     * @returns true if the component has been opened and false otherwise.
     */
    isOpen() {
        return this._opened;
    }
    /**
     * Opens the component.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    open(context) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._opened) {
                return;
            }
            this._opened = true;
            yield this._client.open(context);
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context) {
        this._opened = false;
        return this._client.close(context);
    }
    convertCounter(counter) {
        switch (counter.type) {
            case pip_services4_observability_node_1.CounterType.Increment:
                return [{
                        metric: counter.name,
                        type: DataDogMetricType_1.DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.count }]
                    }];
            case pip_services4_observability_node_1.CounterType.LastValue:
                return [{
                        metric: counter.name,
                        type: DataDogMetricType_1.DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.last }]
                    }];
            case pip_services4_observability_node_1.CounterType.Interval:
            case pip_services4_observability_node_1.CounterType.Statistics:
                return [
                    {
                        metric: counter.name + ".min",
                        type: DataDogMetricType_1.DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.min }]
                    },
                    {
                        metric: counter.name + ".average",
                        type: DataDogMetricType_1.DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.average }]
                    },
                    {
                        metric: counter.name + ".max",
                        type: DataDogMetricType_1.DataDogMetricType.Gauge,
                        host: this._instance,
                        service: this._source,
                        points: [{ time: counter.time, value: counter.max }]
                    }
                ];
        }
        return null;
    }
    convertCounters(counters) {
        const metrics = [];
        for (const counter of counters) {
            const data = this.convertCounter(counter);
            if (data != null && data.length > 0)
                metrics.push(...data);
        }
        return metrics;
    }
    /**
     * Saves the current counters measurements.
     *
     * @param counters      current counters measurements to be saves.
     */
    save(counters) {
        const metrics = this.convertCounters(counters);
        if (metrics.length == 0)
            return;
        const context = pip_services4_components_node_1.Context.fromTraceId('datadog-counters');
        this._client.sendMetrics(context, metrics)
            .catch((err) => {
            this._logger.error(context, err, "Failed to push metrics to DataDog");
        });
    }
}
exports.DataDogCounters = DataDogCounters;
//# sourceMappingURL=DataDogCounters.js.map