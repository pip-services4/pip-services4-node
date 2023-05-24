/** @module config */
import { ConfigParams } from 'pip-services4-commons-node';
import { ConfigReader } from './ConfigReader';
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
export declare abstract class FileConfigReader extends ConfigReader {
    private _path;
    /**
     * Creates a new instance of the config reader.
     *
     * @param path  (optional) a path to configuration file.
     */
    constructor(path?: string);
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config: ConfigParams): void;
    /**
     * Get the path to configuration file..
     *
     * @returns the path to configuration file.
     */
    getPath(): string;
    /**
     * Set the path to configuration file.
     *
     * @param path  a new path to configuration file.
     */
    setPath(path: string): void;
}
