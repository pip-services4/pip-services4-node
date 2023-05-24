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
exports.MemoryConfigReader = void 0;
/** @module config */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_expressions_node_1 = require("pip-services4-expressions-node");
/**
 * Config reader that stores configuration in memory.
 *
 * The reader supports parameterization using Handlebars
 * template engine: [[https://handlebarsjs.com]]
 *
 * ### Configuration parameters ###
 *
 * The configuration parameters are the configuration template
 *
 * @see [[IConfigReader]]
 *
 * ### Example ####
 *
 *     let config = ConfigParams.fromTuples(
 *         "connection.host", "{{SERVICE_HOST}}",
 *         "connection.port", "{{SERVICE_PORT}}{{^SERVICE_PORT}}8080{{/SERVICE_PORT}}"
 *     );
 *
 *     let configReader = new MemoryConfigReader();
 *     configReader.configure(config);
 *
 *     let parameters = ConfigParams.fromValue(process.env);
 *
 *     let config = await configReader.readConfig("123", parameters);
 *     // Possible result: connection.host=10.1.1.100;connection.port=8080
 *
 */
class MemoryConfigReader {
    /**
     * Creates a new instance of config reader.
     *
     * @param config        (optional) component configuration parameters
     */
    constructor(config = null) {
        this._config = new pip_services3_commons_node_1.ConfigParams();
        this._config = config;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        this._config = config;
    }
    /**
     * Reads configuration and parameterize it with given values.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns                 retrieved configuration parameters.
     */
    readConfig(correlationId, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            if (parameters != null) {
                let config = new pip_services3_commons_node_1.ConfigParams(this._config).toString();
                let template = new pip_services3_expressions_node_1.MustacheTemplate(config);
                config = template.evaluateWithVariables(parameters);
                return pip_services3_commons_node_1.ConfigParams.fromString(config);
            }
            else {
                let config = new pip_services3_commons_node_1.ConfigParams(this._config);
                ;
                return config;
            }
        });
    }
    /**
     * Adds a listener that will be notified when configuration is changed
     * @param listener a listener to be added.
     */
    addChangeListener(listener) {
        // Do nothing...
    }
    /**
     * Remove a previously added change listener.
     * @param listener a listener to be removed.
     */
    removeChangeListener(listener) {
        // Do nothing...
    }
}
exports.MemoryConfigReader = MemoryConfigReader;
//# sourceMappingURL=MemoryConfigReader.js.map