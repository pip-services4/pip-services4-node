import { Context } from "pip-services4-components-node";
import { CachedLogger, LogLevel } from "pip-services4-observability-node";

const assert = require('chai').assert;

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
        const context = Context.fromTraceId("987");
        this._logger.fatal(context, null, "Fatal error message");
        this._logger.error(context, null, "Error message");
        this._logger.warn(context, "Warning message");
        this._logger.info(context, "Information message");
        this._logger.debug(context, "Debug message");
        this._logger.trace(context, "Trace message");

        this._logger.dump();

        await new Promise<void>((resolve, reject) => { setTimeout(resolve, 1000); });
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

        await new Promise<void>((resolve, reject) => { setTimeout(resolve, 1000); });
    }
    
}