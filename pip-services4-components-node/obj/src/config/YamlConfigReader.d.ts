import { ConfigParams } from 'pip-services4-commons-node';
import { FileConfigReader } from './FileConfigReader';
/**
 * Config reader that reads configuration from YAML file.
 *
 * The reader supports parameterization using [[https://handlebarsjs.com Handlebars]] template engine.
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
 *     ======== config.yml ======
 *     key1: "{{KEY1_VALUE}}"
 *     key2: "{{KEY2_VALUE}}"
 *     ===========================
 *
 *     let configReader = new YamlConfigReader("config.yml");
 *
 *     let parameters = ConfigParams.fromTuples("KEY1_VALUE", 123, "KEY2_VALUE", "ABC");
 *     let config = await configReader.readConfig("123", parameters);
 *     // Result: key1=123;key2=ABC
 *
 */
export declare class YamlConfigReader extends FileConfigReader {
    /**
     * Creates a new instance of the config reader.
     *
     * @param path  (optional) a path to configuration file.
     */
    constructor(path?: string);
    /**
     * Reads configuration file, parameterizes its content and converts it into JSON object.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param parameters        values to parameters the configuration.
     * @returns                 a JSON object with configuration.
     */
    readObject(correlationId: string, parameters: ConfigParams): any;
    /**
     * Reads configuration and parameterize it with given values.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns                 retrieved configuration parameters.
     */
    readConfig(correlationId: string, parameters: ConfigParams): Promise<ConfigParams>;
    /**
     * Reads configuration file, parameterizes its content and converts it into JSON object.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param file              a path to configuration file.
     * @param parameters        values to parameters the configuration.
     * @returns                 a JSON object with configuration.
     */
    static readObject(correlationId: string, path: string, parameters: ConfigParams): any;
    /**
     * Reads configuration from a file, parameterize it with given values and returns a new ConfigParams object.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param file              a path to configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @param callback          callback function that receives configuration or error.
     */
    static readConfig(correlationId: string, path: string, parameters: ConfigParams): ConfigParams;
}
