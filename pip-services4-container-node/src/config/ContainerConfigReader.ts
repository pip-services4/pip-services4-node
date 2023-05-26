/** @module config */

import { IContext } from 'pip-services4-components-node';
import { JsonConfigReader } from 'pip-services4-config-node';
import { YamlConfigReader } from 'pip-services4-config-node';
import { ConfigException } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';

import { ContainerConfig } from './ContainerConfig';

/**
 * Helper class that reads container configuration from JSON or YAML file.
 */
export class ContainerConfigReader {

    /**
     * Reads container configuration from JSON or YAML file.
     * The type of the file is determined by file extension.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param path              a path to component configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns the read container configuration
     */
    public static readFromFile(context: IContext, path: string, parameters: ConfigParams): ContainerConfig {
        if (path == null) {
            throw new ConfigException(
                context != null ? context.getTraceId() : null,
                "NO_PATH",
                "Missing config file path"
            );
        }

        let ext = path.split('.').pop();

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
    public static readFromJsonFile(context: IContext, path: string, parameters: ConfigParams): ContainerConfig {
        let config = JsonConfigReader.readConfig(context, path, parameters);
        return ContainerConfig.fromConfig(config);
    }

    /**
     * Reads container configuration from YAML file.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param path              a path to component configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns the read container configuration
     */
    public static readFromYamlFile(context: IContext, path: string, parameters: ConfigParams): ContainerConfig {
        let config = YamlConfigReader.readConfig(context, path, parameters);
        return ContainerConfig.fromConfig(config);
    }
		
}