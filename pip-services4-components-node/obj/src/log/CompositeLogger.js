"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeLogger = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const Logger_1 = require("./Logger");
/**
 * Aggregates all loggers from component references under a single component.
 *
 * It allows to log messages and conveniently send them to multiple destinations.
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code> 	(optional) [[ILogger]] components to pass log messages
 *
 * @see [[ILogger]]
 *
 * ### Example ###
 *
 *     class MyComponent implements IConfigurable, IReferenceable {
 *         private _logger: CompositeLogger = new CompositeLogger();
 *
 *         public configure(config: ConfigParams): void {
 *             this._logger.configure(config);
 *             ...
 *         }
 *
 *         public setReferences(references: IReferences): void {
 *             this._logger.setReferences(references);
 *             ...
 *         }
 *
 *         public myMethod(string correlationId): void {
 *             this._logger.debug(correlationId, "Called method mycomponent.mymethod");
 *             ...
 *         }
 *     }
 *
 */
class CompositeLogger extends Logger_1.Logger {
    /**
     * Creates a new instance of the logger.
     *
     * @param references 	references to locate the component dependencies.
     */
    constructor(references = null) {
        super();
        this._loggers = [];
        if (references) {
            this.setReferences(references);
        }
    }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     */
    setReferences(references) {
        super.setReferences(references);
        let loggers = references.getOptional(new pip_services3_commons_node_1.Descriptor(null, "logger", null, null, null));
        for (let logger of loggers) {
            if (typeof logger.log === "function") {
                this._loggers.push(logger);
            }
        }
    }
    /**
     * Writes a log message to the logger destination(s).
     *
     * @param level             a log level.
     * @param correlationId     (optional) transaction id to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     */
    write(level, correlationId, error, message) {
        for (let logger of this._loggers) {
            logger.log(level, correlationId, error, message);
        }
    }
}
exports.CompositeLogger = CompositeLogger;
//# sourceMappingURL=CompositeLogger.js.map