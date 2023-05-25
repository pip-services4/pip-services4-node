"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const ConfigParams_1 = require("../../src/config/ConfigParams");
suite('ConfigParams', () => {
    test('Config Sections', () => {
        let config = ConfigParams_1.ConfigParams.fromTuples("Section1.Key1", "Value1", "Section1.Key2", "Value2", "Section1.Key3", "Value3");
        assert.equal(config.length(), 3);
        assert.equal(config.get("Section1.Key1"), "Value1");
        assert.equal(config.get("Section1.Key2"), "Value2");
        assert.equal(config.get("Section1.Key3"), "Value3");
        assert.isNull(config.get("Section1.Key4"));
        let section2 = ConfigParams_1.ConfigParams.fromTuples("Key1", "ValueA", "Key2", "ValueB");
        config.addSection("Section2", section2);
        assert.equal(config.length(), 5);
        assert.equal(config.get("Section2.Key1"), "ValueA");
        assert.equal(config.get("Section2.Key2"), "ValueB");
        let section1 = config.getSection("Section1");
        assert.equal(section1.length(), 3);
        assert.equal(section1.get("Key1"), "Value1");
        assert.equal(section1.get("Key2"), "Value2");
        assert.equal(section1.get("Key3"), "Value3");
    });
    test('Config From String', () => {
        let config = ConfigParams_1.ConfigParams.fromString("Queue=TestQueue;Endpoint=sb://cvctestbus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=K70UpCUXN1Q5RFykll6/gz4Et14iJrYFnGPlwiFBlow=");
        assert.equal(config.length(), 4);
        assert.equal(config.get("Queue"), "TestQueue");
    });
    test('Config From Object', () => {
        let value = pip_services4_commons_node_1.AnyValueMap.fromTuples("field1", ConfigParams_1.ConfigParams.fromString("field11=123;field12=ABC"), "field2", pip_services4_commons_node_1.AnyValueArray.fromValues(123, "ABC", ConfigParams_1.ConfigParams.fromString("field21=543;field22=XYZ")), "field3", true);
        let config = ConfigParams_1.ConfigParams.fromValue(value);
        assert.equal(config.length(), 7);
        assert.equal(config.getAsInteger("field1.field11"), 123);
        assert.equal(config.get("field1.field12"), "ABC");
        assert.equal(config.getAsInteger("field2.0"), 123);
        assert.equal(config.get("field2.1"), "ABC");
        assert.equal(config.getAsInteger("field2.2.field21"), 543);
        assert.equal(config.get("field2.2.field22"), "XYZ");
        assert.equal(config.getAsBoolean("field3"), true);
    });
});
//# sourceMappingURL=ConfigParams.test.js.map