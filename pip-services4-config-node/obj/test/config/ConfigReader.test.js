"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('chai').assert;
const pip_services4_expressions_node_1 = require("pip-services4-expressions-node");
suite('ConfigReader', () => {
    test('Process Templates', () => {
        let config = "{{#if A}}{{B}}{{/if}}";
        let params = { A: "true", B: "XYZ" };
        let template = new pip_services4_expressions_node_1.MustacheTemplate(config);
        let result = template.evaluateWithVariables(params);
        assert.equal(result, "XYZ");
    });
});
//# sourceMappingURL=ConfigReader.test.js.map