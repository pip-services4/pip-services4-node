"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const pip_services4_components_node_3 = require("pip-services4-components-node");
const NullLogger_1 = require("../../src/log/NullLogger");
const ConsoleLogger_1 = require("../../src/log/ConsoleLogger");
const CompositeLogger_1 = require("../../src/log/CompositeLogger");
const LogLevel_1 = require("../../src/log/LogLevel");
suite('CompositeLogger', () => {
    let _logger;
    setup(() => {
        _logger = new CompositeLogger_1.CompositeLogger();
        let refs = pip_services4_components_node_2.References.fromTuples(new pip_services4_components_node_3.Descriptor("pip-services", "logger", "null", "default", "1.0"), new NullLogger_1.NullLogger(), new pip_services4_components_node_3.Descriptor("pip-services", "logger", "console", "default", "1.0"), new ConsoleLogger_1.ConsoleLogger());
        _logger.setReferences(refs);
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
            _logger.fatal(pip_services4_components_node_1.Context.fromTraceId("123"), ex, "Fatal error");
            _logger.error(pip_services4_components_node_1.Context.fromTraceId("123"), ex, "Recoverable error");
            assert.isNotNull(ex);
        }
    });
});
//# sourceMappingURL=CompositeLogger.test.js.map