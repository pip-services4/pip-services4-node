"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const assert = chai.assert;
const RecursiveObjectReader_1 = require("../../src/reflect/RecursiveObjectReader");
const RecursiveObjectWriter_1 = require("../../src/reflect/RecursiveObjectWriter");
suite('RecursiveObjectWriter', () => {
    test('Set Property', () => {
        const obj = {
            "value1": 123,
            "value2": {
                "value21": 111,
                "value22": 222
            },
            "value3": [444, { "value311": 555 }]
        };
        //RecursiveObjectWriter.setProperty(obj, "", null);
        RecursiveObjectWriter_1.RecursiveObjectWriter.setProperty(obj, "value1", "AAA");
        RecursiveObjectWriter_1.RecursiveObjectWriter.setProperty(obj, "value2", "BBB");
        RecursiveObjectWriter_1.RecursiveObjectWriter.setProperty(obj, "value3.1.value312", "CCC");
        RecursiveObjectWriter_1.RecursiveObjectWriter.setProperty(obj, "value3.3", "DDD");
        RecursiveObjectWriter_1.RecursiveObjectWriter.setProperty(obj, "value4.1", "EEE");
        const values = RecursiveObjectReader_1.RecursiveObjectReader.getProperties(obj);
        //assert.equal(8, values.length);
        assert.equal("AAA", values["value1"]);
        assert.equal("BBB", values["value2"]);
        assert.isUndefined(values["value2.value21"]);
        assert.equal(444, values["value3.0"]);
        assert.equal(555, values["value3.1.value311"]);
        assert.equal("CCC", values["value3.1.value312"]);
        assert.isUndefined(values["value3.2"]);
        assert.equal("DDD", values["value3.3"]);
        assert.equal("EEE", values["value4.1"]);
    });
    test('Set Properties', () => {
        const obj = {
            "value1": 123,
            "value2": {
                "value21": 111,
                "value22": 222
            },
            "value3": [444, { "value311": 555 }]
        };
        let values = {
            //"", null,
            "value1": "AAA",
            "value2": "BBB",
            "value3.1.value312": "CCC",
            "value3.3": "DDD",
            "value4.1": "EEE"
        };
        RecursiveObjectWriter_1.RecursiveObjectWriter.setProperties(obj, values);
        values = RecursiveObjectReader_1.RecursiveObjectReader.getProperties(obj);
        //assert.equal(8, values.length);
        assert.equal("AAA", values["value1"]);
        assert.equal("BBB", values["value2"]);
        assert.isUndefined(values["value2.value21"]);
        assert.equal(444, values["value3.0"]);
        assert.equal(555, values["value3.1.value311"]);
        assert.equal("CCC", values["value3.1.value312"]);
        assert.isUndefined(values["value3.2"]);
        assert.equal("DDD", values["value3.3"]);
        assert.equal("EEE", values["value4.1"]);
    });
});
//# sourceMappingURL=RecursiveObjectWriter.test.js.map