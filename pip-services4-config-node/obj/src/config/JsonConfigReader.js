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
exports.JsonConfigReader = void 0;
/** @module config */
/** @hidden */
const fs = require('fs');
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
const FileConfigReader_1 = require("./FileConfigReader");
/**
 * Config reader that reads configuration from JSON file.
 *
 * The reader supports parameterization using Handlebar template engine.
 *
 * ### Configuration parameters ###
 *
 * - path:          path to configuration file
 * - parameters:    this entire section is used as template parameters
 * - ...
 *
 * @see [[IConfigReader]]
 * @see [[FileConfigReader]]
 *
 * ### Example ###
 *
 *     ======== config.json ======
 *     { "key1": "{{KEY1_VALUE}}", "key2": "{{KEY2_VALUE}}" }
 *     ===========================
 *
 *     let configReader = new JsonConfigReader("config.json");
 *
 *     let parameters = ConfigParams.fromTuples("KEY1_VALUE", 123, "KEY2_VALUE", "ABC");
 *     let config = await configReader.readConfig("123", parameters);
 *     // Result: key1=123;key2=ABC
 *
 */
class JsonConfigReader extends FileConfigReader_1.FileConfigReader {
    /**
     * Creates a new instance of the config reader.
     *
     * @param path  (optional) a path to configuration file.
     */
    constructor(path = null) {
        super(path);
    }
    /**
     * Reads configuration file, parameterizes its content and converts it into JSON object.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param parameters        values to parameters the configuration.
     * @returns                 a JSON object with configuration.
     */
    readObject(context, parameters) {
        if (super.getPath() == null) {
            throw new pip_services4_commons_node_1.ConfigException(context.getTraceId(), "NO_PATH", "Missing config file path");
        }
        try {
            // Todo: make this async?
            let data = fs.readFileSync(super.getPath(), "utf8");
            data = this.parameterize(data, parameters);
            return pip_services4_commons_node_2.JsonConverter.toNullableMap(data);
        }
        catch (e) {
            throw new pip_services4_commons_node_1.FileException(context.getTraceId(), "READ_FAILED", "Failed reading configuration " + super.getPath() + ": " + e)
                .withDetails("path", super.getPath())
                .withCause(e);
        }
    }
    /**
     * Reads configuration and parameterize it with given values.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param parameters        values to parameters the configuration
     * @param callback          callback function that receives configuration or error.
     */
    readConfig(context, parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = this.readObject(context, parameters);
            let config = pip_services4_components_node_1.ConfigParams.fromValue(value);
            return config;
        });
    }
    /**
     * Reads configuration file, parameterizes its content and converts it into JSON object.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param file              a path to configuration file.
     * @param parameters        values to parameters the configuration.
     * @returns                 a JSON object with configuration.
     */
    static readObject(context, path, parameters) {
        return new JsonConfigReader(path).readObject(context, parameters);
    }
    /**
     * Reads configuration from a file, parameterize it with given values and returns a new ConfigParams object.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param file              a path to configuration file.
     * @param parameters        values to parameters the configuration.
     * @returns                 retrieved configuration parameters.
     */
    static readConfig(context, path, parameters) {
        let value = new JsonConfigReader(path).readObject(context, parameters);
        let config = pip_services4_components_node_1.ConfigParams.fromValue(value);
        return config;
    }
}
exports.JsonConfigReader = JsonConfigReader;
//# sourceMappingURL=JsonConfigReader.js.map