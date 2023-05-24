"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigReader = void 0;
/** @module config */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_expressions_node_1 = require("pip-services4-expressions-node");
/**
 * Abstract config reader that supports configuration parameterization.
 *
 * ### Configuration parameters ###
 *
 * - __parameters:__            this entire section is used as template parameters
 *     - ...
 *
 *  @see [[IConfigReader]]
 */
class ConfigReader {
    /**
     * Creates a new instance of the config reader.
     */
    constructor() {
        this._parameters = new pip_services3_commons_node_1.ConfigParams();
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        let parameters = config.getSection("parameters");
        if (parameters.length() > 0) {
            this._parameters = parameters;
        }
    }
    /**
     * Parameterized configuration template given as string with dynamic parameters.
     *
     * The method uses [[https://handlebarsjs.com Handlebars]] template engine.
     *
     * @param config        a string with configuration template to be parameterized
     * @param parameters    dynamic parameters to inject into the template
     * @returns a parameterized configuration string.
     */
    parameterize(config, parameters) {
        parameters = this._parameters.override(parameters);
        let template = new pip_services3_expressions_node_1.MustacheTemplate(config);
        return template.evaluateWithVariables(parameters);
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
exports.ConfigReader = ConfigReader;
//# sourceMappingURL=ConfigReader.js.map