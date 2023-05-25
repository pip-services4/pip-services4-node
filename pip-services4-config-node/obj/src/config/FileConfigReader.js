"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileConfigReader = void 0;
const ConfigReader_1 = require("./ConfigReader");
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
class FileConfigReader extends ConfigReader_1.ConfigReader {
    /**
     * Creates a new instance of the config reader.
     *
     * @param path  (optional) a path to configuration file.
     */
    constructor(path = null) {
        super();
        this._path = path;
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        super.configure(config);
        this._path = config.getAsStringWithDefault("path", this._path);
    }
    /**
     * Get the path to configuration file..
     *
     * @returns the path to configuration file.
     */
    getPath() {
        return this._path;
    }
    /**
     * Set the path to configuration file.
     *
     * @param path  a new path to configuration file.
     */
    setPath(path) {
        this._path = path;
    }
}
exports.FileConfigReader = FileConfigReader;
//# sourceMappingURL=FileConfigReader.js.map