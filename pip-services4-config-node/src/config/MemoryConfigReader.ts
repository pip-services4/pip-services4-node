/** @module config */
import { ConfigParams } from 'pip-services4-commons-node';
import { IReconfigurable } from 'pip-services4-commons-node';
import { INotifiable } from 'pip-services4-commons-node';
import { MustacheTemplate } from 'pip-services4-expressions-node';

import { IConfigReader } from './IConfigReader';

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
export class MemoryConfigReader implements IConfigReader, IReconfigurable {
    protected _config: ConfigParams = new ConfigParams();

    /**
     * Creates a new instance of config reader.
     * 
     * @param config        (optional) component configuration parameters
     */
    public constructor(config: ConfigParams = null) {
        this._config = config;
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        this._config = config;
    }

    /**
     * Reads configuration and parameterize it with given values.
     * 
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns                 retrieved configuration parameters.
     */
    public async readConfig(correlationId: string, parameters: ConfigParams): Promise<ConfigParams> {
        if (parameters != null) {
            let config = new ConfigParams(this._config).toString();
            let template = new MustacheTemplate(config);
            config = template.evaluateWithVariables(parameters);
            return ConfigParams.fromString(config);
        } else {
            let config = new ConfigParams(this._config);;
            return config;
        }
    }

    /**
     * Adds a listener that will be notified when configuration is changed
     * @param listener a listener to be added.
     */
    public addChangeListener(listener: INotifiable): void {
        // Do nothing...
    }

     /**
      * Remove a previously added change listener.
      * @param listener a listener to be removed.
      */
    public removeChangeListener(listener: INotifiable): void {
        // Do nothing...
    }
 
}