/** @module config */
import { IContext } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { ContainerConfig } from './ContainerConfig';
/**
 * Helper class that reads container configuration from JSON or YAML file.
 */
export declare class ContainerConfigReader {
    /**
     * Reads container configuration from JSON or YAML file.
     * The type of the file is determined by file extension.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param path              a path to component configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns the read container configuration
     */
    static readFromFile(context: IContext, path: string, parameters: ConfigParams): ContainerConfig;
    /**
     * Reads container configuration from JSON file.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param path              a path to component configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns the read container configuration
     */
    static readFromJsonFile(context: IContext, path: string, parameters: ConfigParams): ContainerConfig;
    /**
     * Reads container configuration from YAML file.
     *
     * @param context     (optional) a context to trace execution through call chain.
     * @param path              a path to component configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns the read container configuration
     */
    static readFromYamlFile(context: IContext, path: string, parameters: ConfigParams): ContainerConfig;
}
