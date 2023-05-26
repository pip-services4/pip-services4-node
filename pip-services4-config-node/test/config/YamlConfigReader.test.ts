const assert = require('chai').assert;

import { ConfigParams, Context } from 'pip-services4-components-node';

import { YamlConfigReader } from '../../src/config/YamlConfigReader';

suite('YamlConfigReader', ()=> {

    test('Config Sections', () => {
        let parameters = ConfigParams.fromTuples(
            "param1", "Test Param 1",
            "param2", "Test Param 2"
        );
        let config: ConfigParams = YamlConfigReader.readConfig(null, "./data/config.yaml", parameters);

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
