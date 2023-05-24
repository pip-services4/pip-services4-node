"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerConfigReader = void 0;
/** @module config */
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_components_node_2 = require("pip-services4-components-node");
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const ContainerConfig_1 = require("./ContainerConfig");
/**
 * Helper class that reads container configuration from JSON or YAML file.
 */
class ContainerConfigReader {
    /**
     * Reads container configuration from JSON or YAML file.
     * The type of the file is determined by file extension.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param path              a path to component configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns the read container configuration
     */
    static readFromFile(correlationId, path, parameters) {
        if (path == null) {
            throw new pip_services3_commons_node_1.ConfigException(correlationId, "NO_PATH", "Missing config file path");
        }
        let ext = path.split('.').pop();
        if (ext == "json") {
            return ContainerConfigReader.readFromJsonFile(correlationId, path, parameters);
        }
        if (ext == "yaml" || ext == "yml") {
            return ContainerConfigReader.readFromYamlFile(correlationId, path, parameters);
        }
        // By default read as JSON
        return ContainerConfigReader.readFromJsonFile(correlationId, path, parameters);
    }
    /**
     * Reads container configuration from JSON file.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param path              a path to component configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns the read container configuration
     */
    static readFromJsonFile(correlationId, path, parameters) {
        let config = pip_services3_components_node_1.JsonConfigReader.readConfig(correlationId, path, parameters);
        return ContainerConfig_1.ContainerConfig.fromConfig(config);
    }
    /**
     * Reads container configuration from YAML file.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param path              a path to component configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns the read container configuration
     */
    static readFromYamlFile(correlationId, path, parameters) {
        let config = pip_services3_components_node_2.YamlConfigReader.readConfig(correlationId, path, parameters);
        return ContainerConfig_1.ContainerConfig.fromConfig(config);
    }
}
exports.ContainerConfigReader = ContainerConfigReader;
//# sourceMappingURL=ContainerConfigReader.js.map