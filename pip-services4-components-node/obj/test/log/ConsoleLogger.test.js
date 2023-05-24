"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const ConsoleLogger_1 = require("../../src/log/ConsoleLogger");
const LogLevel_1 = require("../../src/log/LogLevel");
suite('ConsoleLogger', () => {
    let _logger;
    setup(() => {
        _logger = new ConsoleLogger_1.ConsoleLogger();
    });
    test('Log Level', () => {
        assert.isTrue(_logger.getLevel() >= LogLevel_1.LogLevel.None);
        assert.isTrue(_logger.getLevel() <= LogLevel_1.LogLevel.Trace);
    });
    test('Simple Logging', () => {
        _logger.setLevel(LogLevel_1.LogLevel.Trace);
        _logger.fatal(null, null, "Fatal error message");
        _logger.error(null, null, "Error message");
        _logger.warn(null, "Warning message");
        _logger.info(null, "Information message");
        _logger.debug(null, "Debug message");
        _logger.trace(null, "Trace message");
    });
    test('Error Logging', () => {
        try {
            // Raise an exception
            throw new Error();
        }
        catch (ex) {
            _logger.fatal("123", ex, "Fatal error");
            _logger.error("123", ex, "Recoverable error");
            assert.isNotNull(ex);
        }
    });
});
//# sourceMappingURL=ConsoleLogger.test.js.map