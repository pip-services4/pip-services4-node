"use strict";
/** @module config */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerConfigReader = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_config_node_1 = require("pip-services4-config-node");
const pip_services4_config_node_2 = require("pip-services4-config-node");
const ContainerConfig_1 = require("./ContainerConfig");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
/**
 * Helper class that reads container configuration from JSON or YAML file.
 */
class ContainerConfigReader {
    /**
     * Reads container configuration from JSON or YAML file.
     * The type of the file is determined by file extension.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param path              a path to component configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns the read container configuration
     */
    static readFromFile(context, path, parameters) {
        if (path == null) {
            throw new pip_services4_commons_node_1.ConfigException(context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, "NO_PATH", "Missing config file path");
        }
        const ext = path.split('.').pop();
        if (ext == "json") {
            return ContainerConfigReader.readFromJsonFile(context, path, parameters);
        }
        if (ext == "yaml" || ext == "yml") {
            return ContainerConfigReader.readFromYamlFile(context, path, parameters);
        }
        // By default read as JSON
        return ContainerConfigReader.readFromJsonFile(context, path, parameters);
    }
    /**
     * Reads container configuration from JSON file.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param path              a path to component configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns the read container configuration
     */
    static readFromJsonFile(context, path, parameters) {
        const config = pip_services4_config_node_1.JsonConfigReader.readConfig(context, path, parameters);
        return ContainerConfig_1.ContainerConfig.fromConfig(config);
    }
    /**
     * Reads container configuration from YAML file.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param path              a path to component configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns the read container configuration
     */
    static readFromYamlFile(context, path, parameters) {
        const config = pip_services4_config_node_2.YamlConfigReader.readConfig(context, path, parameters);
        return ContainerConfig_1.ContainerConfig.fromConfig(config);
    }
}
exports.ContainerConfigReader = ContainerConfigReader;
//# sourceMappingURL=ContainerConfigReader.js.map