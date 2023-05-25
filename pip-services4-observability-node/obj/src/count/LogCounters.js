"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogCounters = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const CachedCounters_1 = require("./CachedCounters");
const CompositeLogger_1 = require("../log/CompositeLogger");
/**
 * Performance counters that periodically dumps counters measurements to logger.
 *
 * ### Configuration parameters ###
 *
 * - __options:__
 *     - interval:          interval in milliseconds to save current counters measurements (default: 5 mins)
 *     - reset_timeout:     timeout in milliseconds to reset the counters. 0 disables the reset (default: 0)
 *
 * ### References ###
 *
 * - <code>\*:logger:\*:\*:1.0</code>           [[ILogger]] components to dump the captured counters
 * - <code>\*:context-info:\*:\*:1.0</code>     (optional) [[ContextInfo]] to detect the context id and specify counters source
 *
 * @see [[Counter]]
 * @see [[CachedCounters]]
 * @see [[CompositeLogger]]
 *
 * ### Example ###
 *
 *     let counters = new LogCounters();
 *     counters.setReferences(References.fromTuples(
 *         new Descriptor("pip-services", "logger", "console", "default", "1.0"), new ConsoleLogger()
 *     ));
 *
 *     counters.increment("mycomponent.mymethod.calls");
 *     let timing = counters.beginTiming("mycomponent.mymethod.exec_time");
 *     try {
 *         ...
 *     } finally {
 *         timing.endTiming();
 *     }
 *
 *     counters.dump();
 */
class LogCounters extends CachedCounters_1.CachedCounters {
    constructor() {
        super(...arguments);
        this._logger = new CompositeLogger_1.CompositeLogger();
    }
    /**
     * Creates a new instance of the counters.
     */
    LogCounters() { }
    /**
     * Sets references to dependent components.
     *
     * @param references 	references to locate the component dependencies.
     *
     */
    setReferences(references) {
        this._logger.setReferences(references);
    }
    counterToString(counter) {
        let result = "Counter " + counter.name + " { ";
        result += "\"type\": " + counter.type;
        if (counter.last != null)
            result += ", \"last\": " + pip_services4_commons_node_1.StringConverter.toString(counter.last);
        if (counter.count != null)
            result += ", \"count\": " + pip_services4_commons_node_1.StringConverter.toString(counter.count);
        if (counter.min != null)
            result += ", \"min\": " + pip_services4_commons_node_1.StringConverter.toString(counter.min);
        if (counter.max != null)
            result += ", \"max\": " + pip_services4_commons_node_1.StringConverter.toString(counter.max);
        if (counter.average != null)
            result += ", \"avg\": " + pip_services4_commons_node_1.StringConverter.toString(counter.average);
        if (counter.time != null)
            result += ", \"time\": " + pip_services4_commons_node_1.StringConverter.toString(counter.time);
        result += " }";
        return result;
    }
    /**
     * Saves the current counters measurements.
     *
     * @param counters      current counters measurements to be saves.
     */
    save(counters) {
        if (this._logger == null || counters == null) {
            return;
        }
        if (counters.length == 0)
            return;
        counters.sort((c1, c2) => {
            if (c1.name < c2.name)
                return -1;
            if (c1.name > c2.name)
                return 1;
            return 0;
        });
        for (let i = 0; i < counters.length; i++) {
            this._logger.info(null, this.counterToString(counters[i]));
        }
    }
}
exports.LogCounters = LogCounters;
//# sourceMappingURL=LogCounters.js.map