import { Context } from "pip-services4-components-node";
import { CachedLogger, LogLevel } from "pip-services4-observability-node";

let assert = require('chai').assert;

export class LoggerFixture {
    private _logger: CachedLogger;

    public constructor(logger: CachedLogger) {
        this._logger = logger;
    }

    public testLogLevel() {
        assert.isTrue(this._logger.getLevel() >= LogLevel.None);
        assert.isTrue(this._logger.getLevel() <= LogLevel.Trace);
    }

    public async testSimpleLogging() {
        this._logger.setLevel(LogLevel.Trace);

        this._logger.fatal(null, null, "Fatal error message");
        this._logger.error(null, null, "Error message");
        this._logger.warn(null, "Warning message");
        this._logger.info(null, "Information message");
        this._logger.debug(null, "Debug message");
        this._logger.trace(null, "Trace message");

        this._logger.dump();

        await new Promise((resolve, reject) => { setTimeout(resolve, 1000); });
    }

    public async testErrorLogging() {
        try {
            // Raise an exception
            throw new Error();
        } catch (ex) {
            this._logger.fatal(Context.fromTraceId("123"), ex, "Fatal error");
            this._logger.error(Context.fromTraceId("123"), ex, "Recoverable error");

            assert.isNotNull(ex);
        }

        this._logger.dump();

        await new Promise((resolve, reject) => { setTimeout(resolve, 1000); });
    }
    
}