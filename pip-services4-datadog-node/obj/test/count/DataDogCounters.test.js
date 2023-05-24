"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const DataDogCounters_1 = require("../../src/count/DataDogCounters");
const CountersFixture_1 = require("../fixtures/CountersFixture");
suite('DataDogCounters', () => {
    let _counters;
    let _fixture;
    setup(() => __awaiter(void 0, void 0, void 0, function* () {
        let apiKey = process.env['DATADOG_API_KEY'] || '3eb3355caf628d4689a72084425177ac';
        _counters = new DataDogCounters_1.DataDogCounters();
        _fixture = new CountersFixture_1.CountersFixture(_counters);
        let config = pip_services3_commons_node_1.ConfigParams.fromTuples('source', 'test', 'credential.access_key', apiKey);
        _counters.configure(config);
        yield _counters.open(null);
    }));
    teardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield _counters.close(null);
    }));
    test('Simple Counters', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testSimpleCounters();
    }));
    test('Measure Elapsed Time', () => __awaiter(void 0, void 0, void 0, function* () {
        yield _fixture.testMeasureElapsedTime();
    }));
});
//# sourceMappingURL=DataDogCounters.test.js.map