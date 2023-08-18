/** @module config */
/** @hidden */ 
import fs = require('fs');
/** @hidden */ 
import yaml = require('js-yaml');

import { ContextResolver, IContext } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { ConfigException, FileException } from 'pip-services4-commons-node';

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
export class YamlConfigReader extends FileConfigReader {

    /** 
     * Creates a new instance of the config reader.
     * 
     * @param path  (optional) a path to configuration file.
     */
    public constructor(path: string = null) {
        super(path);
    }

    /**
     * Reads configuration file, parameterizes its content and converts it into JSON object.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param parameters        values to parameters the configuration.
     * @returns                 a JSON object with configuration.
     */
    public readObject(context: IContext, parameters: ConfigParams): any {
        if (super.getPath() == null)
            throw new ConfigException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "NO_PATH",
                "Missing config file path"
            );

        try {
            let content = fs.readFileSync(super.getPath(), 'utf8');
            content = this.parameterize(content, parameters);
            const data = yaml.load(content);
            return data;
        } catch (e) {
            throw new FileException(
                context != null ? ContextResolver.getTraceId(context) : null,
                "READ_FAILED",
                "Failed reading configuration " + super.getPath() + ": " + e
            )
            .withDetails("path", super.getPath())
            .withCause(e);
        }
    }
    
    /**
     * Reads configuration and parameterize it with given values.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns                 retrieved configuration parameters.
     */
    public async readConfig(context: IContext, parameters: ConfigParams): Promise<ConfigParams> {
        const value: any = this.readObject(context, parameters);
        const config = ConfigParams.fromValue(value);
        return config;
    }

    /**
     * Reads configuration file, parameterizes its content and converts it into JSON object.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param file              a path to configuration file.
     * @param parameters        values to parameters the configuration.
     * @returns                 a JSON object with configuration.
     */
    public static readObject(context: IContext, path: string, parameters: ConfigParams): any {
        return new YamlConfigReader(path).readObject(context, parameters);
    }

    /**
     * Reads configuration from a file, parameterize it with given values and returns a new ConfigParams object.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param file              a path to configuration file.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @param callback          callback function that receives configuration or error.
     */
    public static readConfig(context: IContext, path: string, parameters: ConfigParams): ConfigParams {
        const value: any = new YamlConfigReader(path).readObject(context, parameters);
        const config = ConfigParams.fromValue(value);
        return config;
    }
}