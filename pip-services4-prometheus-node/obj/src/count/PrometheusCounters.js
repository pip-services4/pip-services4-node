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
exports.PrometheusCounters = void 0;
/** @module count */
/** @hidden */
let os = require('os');
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
const pip_services4_config_node_1 = require("pip-services4-config-node");
const PrometheusCounterConverter_1 = require("./PrometheusCounterConverter");
/**
 * Performance counters that send their metrics to Prometheus controller.
 *
 * The component is normally used in passive mode conjunction with [[PrometheusMetricsController]].
 * Alternatively when connection parameters are set it can push metrics to Prometheus PushGateway.
 *
 * ### Configuration parameters ###
 *
 * - connection(s):
 *   - discovery_key:         (optional) a key to retrieve the connection from [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]]
 *   - protocol:              connection protocol: http or https
 *   - host:                  host name or IP address
 *   - port:                  port number
 *   - uri:                   resource URI or connection string with all parameters in it
 * - options:
 *   - retries:               number of retries (default: 3)
 *   - connect_timeout:       connection timeout in milliseconds (default: 10 sec)
 *   - timeout:               invocation timeout in milliseconds (default: 10 sec)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/log.ilogger.html ILogger]] components to pass log messages
 * - <code>\*:counters:\*:\*:1.0</code>         (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/count.icounters.html ICounters]] components to pass collected measurements
 * - <code>\*:discovery:\*:\*:1.0</code>        (optional) [[https://pip-services4-node.github.io/pip-services4-components-node/interfaces/connect.idiscovery.html IDiscovery]] controllers to resolve connection
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-rpc-node/classes/controllers.restcontroller.html RestController]]
 * @see [[https://pip-services4-node.github.io/pip-services4-rpc-node/classes/controllers.commandablehttpcontroller.html CommandableHttpController]]
 *
 * ### Example ###
 *
 *     let counters = new PrometheusCounters();
 *     counters.configure(ConfigParams.fromTuples(
 *         "connection.protocol", "http",
 *         "connection.host", "localhost",
 *         "connection.port", 8080
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
class PrometheusCounters extends pip_services4_observability_node_1.CachedCounters {
    /**
     * Creates a new instance of the performance counters.
     */
    constructor() {
        super();
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        this._connectionResolver = new pip_services4_config_node_1.HttpConnectionResolver();
        this._opened = false;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        super.configure(config);
        this._connectionResolver.configure(config);
        this._source = config.getAsStringWithDefault("source", this._source);
        this._instance = config.getAsStringWithDefault("instance", this._instance);
        this._pushEnabled = config.getAsBooleanWithDefault("push_enabled", true);
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        this._logger.setReferences(references);
        this._connectionResolver.setReferences(references);
        let contextInfo = references.getOneOptional(new pip_services4_components_node_1.Descriptor("pip-services", "context-info", "default", "*", "1.0"));
        if (contextInfo != null && this._source == null) {
            this._source = contextInfo.name;
        }
        if (contextInfo != null && this._instance == null) {
            this._instance = contextInfo.contextId;
        }
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
            if (!this._pushEnabled) {
                return;
            }
            this._opened = true;
            try {
                let connection = yield this._connectionResolver.resolve(context);
                let job = this._source || "unknown";
                let instance = this._instance || os.hostname();
                this._requestRoute = "/metrics/job/" + job + "/instance/" + instance;
                let restify = require('restify-clients');
                this._client = restify.createStringClient({ url: connection.getAsString("uri") });
            }
            catch (ex) {
                this._client = null;
                this._logger.warn(context, "Connection to Prometheus server is not configured: " + ex);
            }
        });
    }
    /**
     * Closes component and frees used resources.
     *
     * @param context 	(optional) execution context to trace execution through call chain.
     */
    close(context) {
        return __awaiter(this, void 0, void 0, function* () {
            this._opened = false;
            this._client = null;
            this._requestRoute = null;
        });
    }
    /**
     * Saves the current counters measurements.
     *
     * @param counters      current counters measurements to be saves.
     */
    save(counters) {
        if (this._client == null || !this._pushEnabled)
            return;
        let body = PrometheusCounterConverter_1.PrometheusCounterConverter.toString(counters, null, null);
        this._client.put(this._requestRoute, body, (err, req, res, data) => {
            if (err || res.statusCode >= 400)
                this._logger.error(pip_services4_components_node_1.Context.fromTraceId("prometheus-counters"), err, "Failed to push metrics to prometheus");
        });
    }
}
exports.PrometheusCounters = PrometheusCounters;
//# sourceMappingURL=PrometheusCounters.js.map