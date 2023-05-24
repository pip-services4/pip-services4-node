"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const YamlConfigReader_1 = require("../../src/config/YamlConfigReader");
suite('YamlConfigReader', () => {
    test('Config Sections', () => {
        let parameters = pip_services3_commons_node_1.ConfigParams.fromTuples("param1", "Test Param 1", "param2", "Test Param 2");
        let config = YamlConfigReader_1.YamlConfigReader.readConfig(null, "./data/config.yaml", parameters);
        assert.equal(config.length(), 9);
        assert.equal(config.getAsInteger("field1.field11"), 123);
        assert.equal(config.get("field1.field12"), "ABC");
        assert.equal(config.getAsInteger("field2.0"), 123);
        assert.equal(config.get("field2.1"), "ABC");
        assert.equal(config.getAsInteger("field2.2.field21"), 543);
        assert.equal(config.get("field2.2.field22"), "XYZ");
        assert.equal(config.getAsBoolean("field3"), true);
        assert.equal(config.get("field4"), "Test Param 1");
        assert.equal(config.get("field5"), "Test Param 2");
    });
});
//# sourceMappingURL=YamlConfigReader.test.js.map