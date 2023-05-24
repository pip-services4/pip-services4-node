/** @module config */
import { ConfigParams } from 'pip-services4-commons-node';
import { IReconfigurable } from 'pip-services4-commons-node';
import { INotifiable } from 'pip-services4-commons-node';
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
export declare class MemoryConfigReader implements IConfigReader, IReconfigurable {
    protected _config: ConfigParams;
    /**
     * Creates a new instance of config reader.
     *
     * @param config        (optional) component configuration parameters
     */
    constructor(config?: ConfigParams);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Reads configuration and parameterize it with given values.
     *
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns                 retrieved configuration parameters.
     */
    readConfig(correlationId: string, parameters: ConfigParams): Promise<ConfigParams>;
    /**
     * Adds a listener that will be notified when configuration is changed
     * @param listener a listener to be added.
     */
    addChangeListener(listener: INotifiable): void;
    /**
     * Remove a previously added change listener.
     * @param listener a listener to be removed.
     */
    removeChangeListener(listener: INotifiable): void;
}
