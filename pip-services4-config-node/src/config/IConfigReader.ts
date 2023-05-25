/** @module config */

import { IContext } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { INotifiable } from 'pip-services4-components-node';

/**
 * Interface for configuration readers that retrieve configuration from various sources
 * and make it available for other components.
 * 
 * Some IConfigReader implementations may support configuration parameterization.
 * The parameterization allows to use configuration as a template and inject there dynamic values.
 * The values may come from application command like arguments or environment variables.
 */
export interface IConfigReader {
    
    /**
     * Reads configuration and parameterize it with given values.
     * 
     * @param context     (optional) a context to trace execution through call chain.
     * @param parameters        values to parameters the configuration or null to skip parameterization.
     * @returns                 retrieved configuration parameters.
     */
    readConfig(context: IContext, parameters: ConfigParams): Promise<ConfigParams>;

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