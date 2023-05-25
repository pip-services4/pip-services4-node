"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const ConfigParams_1 = require("../../src/config/ConfigParams");
const NameResolver_1 = require("../../src/config/NameResolver");
suite('NameResolver', () => {
    test('Resolve Name', () => {
        let config = ConfigParams_1.ConfigParams.fromTuples("id", "ABC");
        let name = NameResolver_1.NameResolver.resolve(config);
        assert.equal(name, 'ABC');
        config = ConfigParams_1.ConfigParams.fromTuples("name", "ABC");
        name = NameResolver_1.NameResolver.resolve(config);
        assert.equal(name, 'ABC');
    });
    test('Resolve Empty Name', () => {
        let config = ConfigParams_1.ConfigParams.fromTuples();
        let name = NameResolver_1.NameResolver.resolve(config);
        assert.isNull(name);
    });
});
//# sourceMappingURL=NameResolver.test.js.map