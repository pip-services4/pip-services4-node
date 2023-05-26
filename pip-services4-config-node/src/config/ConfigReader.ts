/** @module config */

import { ConfigParams, IConfigurable, IContext, INotifiable } from 'pip-services4-components-node';
import { MustacheTemplate } from 'pip-services4-expressions-node';
import { IConfigReader } from './IConfigReader';

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
export abstract class ConfigReader implements IConfigurable, IConfigReader {
    private _parameters: ConfigParams = new ConfigParams();

    /**
     * Creates a new instance of the config reader.
     */
    public constructor() {
        //
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        const parameters = config.getSection("parameters")
        if (parameters.length() > 0) {
            this._parameters = parameters;
        }
    }    

    /**
     * Reads configuration and parameterize it with given values.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns                 retrieved configuration parameters.
     */
    public abstract readConfig(context: IContext, parameters: ConfigParams): Promise<ConfigParams>;

    /**
     * Parameterized configuration template given as string with dynamic parameters.
     * 
     * The method uses [[https://handlebarsjs.com Handlebars]] template engine.
     * 
     * @param config        a string with configuration template to be parameterized
     * @param parameters    dynamic parameters to inject into the template
     * @returns a parameterized configuration string.
     */
    protected parameterize(config: string, parameters: ConfigParams): string {
        parameters = this._parameters.override(parameters);

        const template = new MustacheTemplate(config);
        return template.evaluateWithVariables(parameters);
    }

    /**
     * Adds a listener that will be notified when configuration is changed
     * @param listener a listener to be added.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public addChangeListener(listener: INotifiable): void {
        // Do nothing...
    }

    /**
     * Remove a previously added change listener.
     * @param listener a listener to be removed.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public removeChangeListener(listener: INotifiable): void {
        // Do nothing...
    }
     
}