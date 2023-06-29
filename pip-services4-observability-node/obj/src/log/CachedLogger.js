"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedLogger = void 0;
/** @module log */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const Logger_1 = require("./Logger");
const LogLevelConverter_1 = require("./LogLevelConverter");
/**
 * Abstract logger that caches captured log messages in memory and periodically dumps them.
 * Child classes implement saving cached messages to their specified destinations.
 *
 * ### Configuration parameters ###
 *
 * - level:             maximum log level to capture
 * - source:            source (context) name
 * - options:
 *     - interval:        interval in milliseconds to save log messages (default: 10 seconds)
 *     - max_cache_size:  maximum number of messages stored in this cache (default: 100)
 *
 * ### References ###
 *
 * - <code>\*:context-info:\*:\*:1.0</code>     (optional) [[ContextInfo]] to detect the context id and specify counters source
 *
 * @see [[ILogger]]
 * @see [[Logger]]
 * @see [[LogMessage]]
 */
class CachedLogger extends Logger_1.Logger {
    /**
     * Creates a new instance of the logger.
     */
    constructor() {
        super();
        this._cache = [];
        this._updated = false;
        this._lastDumpTime = new Date().getTime();
        this._maxCacheSize = 100;
        this._interval = 10000;
    }
    /**
     * Writes a log message to the logger destination.
     *
     * @param level             a log level.
     * @param context     (optional) a context to trace execution through call chain.
     * @param error             an error object associated with this message.
     * @param message           a human-readable message to log.
     */
    write(level, context, error, message) {
        const errorDesc = error != null ? pip_services4_commons_node_1.ErrorDescriptionFactory.create(error) : null;
        const logMessage = {
            time: new Date(),
            level: LogLevelConverter_1.LogLevelConverter.toString(level),
            source: this._source,
            trace_id: context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null,
            error: errorDesc,
            message: message
        };
        this._cache.push(logMessage);
        this.update();
    }
    /**
     * Configures component by passing configuration parameters.
     *
     * @param config    configuration parameters to be set.
     */
    configure(config) {
        super.configure(config);
        this._interval = config.getAsLongWithDefault("options.interval", this._interval);
        this._maxCacheSize = config.getAsIntegerWithDefault("options.max_cache_size", this._maxCacheSize);
    }
    /**
     * Clears (removes) all cached log messages.
     */
    clear() {
        this._cache = [];
        this._updated = false;
    }
    /**
     * Dumps (writes) the currently cached log messages.
     *
     * @see [[write]]
     */
    dump() {
        if (this._updated) {
            if (!this._updated)
                return;
            const messages = this._cache;
            this._cache = [];
            this.save(messages)
                .catch((err) => {
                // Adds messages back to the cache
                messages.push(...this._cache);
                this._cache = messages;
                // Truncate cache
                const deleteCount = this._cache.length - this._maxCacheSize;
                if (deleteCount > 0) {
                    this._cache.splice(0, deleteCount);
                }
                console.error(err);
            });
            this._updated = false;
            this._lastDumpTime = new Date().getTime();
        }
    }
    /**
     * Makes message cache as updated
     * and dumps it when timeout expires.
     *
     * @see [[dump]]
     */
    update() {
        this._updated = true;
        const now = new Date().getTime();
        if (now > this._lastDumpTime + this._interval) {
            this.dump();
        }
    }
}
exports.CachedLogger = CachedLogger;
//# sourceMappingURL=CachedLogger.js.map