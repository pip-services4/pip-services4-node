"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_commons_node_3 = require("pip-services4-commons-node");
const ComponentConfig_1 = require("../../src/config/ComponentConfig");
suite('ComponentConfig', () => {
    let componentConfig;
    setup(() => {
        componentConfig = new ComponentConfig_1.ComponentConfig();
    });
    test('Type', () => {
        assert.isUndefined(componentConfig.type);
        let type = new pip_services3_commons_node_2.TypeDescriptor("new name", null);
        componentConfig.type = type;
        assert.equal(componentConfig.type, type);
    });
    test('Descriptor', () => {
        assert.isUndefined(componentConfig.descriptor);
        let descriptor = new pip_services3_commons_node_3.Descriptor("group", "type", "id", "default", "version");
        componentConfig.descriptor = descriptor;
        assert.equal(componentConfig.descriptor, descriptor);
    });
    test('ConfigParams', () => {
        assert.isUndefined(componentConfig.config);
        let config = pip_services3_commons_node_1.ConfigParams.fromTuples("config.key", "key", "config.key2", "key2");
        componentConfig.config = config;
        assert.equal(componentConfig.config, config);
    });
    test('From Empty Config', () => {
        let config = pip_services3_commons_node_1.ConfigParams.fromTuples();
        try {
            componentConfig = ComponentConfig_1.ComponentConfig.fromConfig(config);
        }
        catch (ex) {
            assert.equal(ex.message, "Component configuration must have descriptor or type");
        }
    });
    test('From Wrong Config', () => {
        let config = pip_services3_commons_node_1.ConfigParams.fromTuples("descriptor", "descriptor_name", "type", "type", "config.key", "key", "config.key2", "key2");
        try {
            componentConfig = ComponentConfig_1.ComponentConfig.fromConfig(config);
        }
        catch (ex) {
            assert.equal(ex.message, "Descriptor descriptor_name is in wrong format");
        }
    });
    test('From Correct Config', () => {
        let descriptor = new pip_services3_commons_node_3.Descriptor("group", "type", "id", "name", "version");
        let type = new pip_services3_commons_node_2.TypeDescriptor("type", null);
        let config = pip_services3_commons_node_1.ConfigParams.fromTuples("descriptor", "group:type:id:name:version", "type", "type", "config.key", "key", "config.key2", "key2");
        componentConfig = ComponentConfig_1.ComponentConfig.fromConfig(config);
        assert.deepEqual(componentConfig.descriptor, descriptor);
        assert.deepEqual(componentConfig.type, type);
    });
});
//# sourceMappingURL=ComponentConfig.test.js.map