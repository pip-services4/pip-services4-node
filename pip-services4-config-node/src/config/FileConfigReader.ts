/** @module config */
import { ConfigParams } from 'pip-services4-components-node';

import { ConfigReader } from './ConfigReader'

/**
 * Abstract config reader that reads configuration from a file.
 * Child classes add support for config files in their specific format
 * like JSON, YAML or property files.
 * 
 * ### Configuration parameters ###
 * 
 * - path:          path to configuration file
 * - parameters:    this entire section is used as template parameters
 * - ...
 * 
 * @see [[IConfigReader]]
 * @see [[ConfigReader]]
 */
export abstract class FileConfigReader extends ConfigReader {
    private _path: string;

    /**
     * Creates a new instance of the config reader.
     * 
     * @param path  (optional) a path to configuration file.
     */
    public constructor(path: string = null) {
        super();
        this._path = path;
    }

    /**
     * Configures component by passing configuration parameters.
     * 
     * @param config    configuration parameters to be set.
     */
    public configure(config: ConfigParams): void {
        super.configure(config);
        this._path = config.getAsStringWithDefault("path", this._path);
    }    

    /**
     * Get the path to configuration file..
     * 
     * @returns the path to configuration file.
     */
    public getPath(): string {
        return this._path;
    }

    /**
     * Set the path to configuration file.
     * 
     * @param path  a new path to configuration file.
     */
    public setPath(path: string) {
        this._path = path;
    }

}