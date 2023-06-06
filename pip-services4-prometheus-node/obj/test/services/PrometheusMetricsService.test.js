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
let assert = require('chai').assert;
let restify = require('restify-clients');
const PrometheusMetricsController_1 = require("../../src/controllers/PrometheusMetricsController");
const PrometheusCounters_1 = require("../../src/count/PrometheusCounters");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
let restConfig = pip_services4_components_node_1.ConfigParams.fromTuples("connection.protocol", "http", "connection.host", "localhost", "connection.port", 3000);
suite('PrometheusMetricsController', () => {
    let controller;
    let counters;
    let rest;
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        controller = new PrometheusMetricsController_1.PrometheusMetricsController();
        controller.configure(restConfig);
        counters = new PrometheusCounters_1.PrometheusCounters();
        let contextInfo = new pip_services4_components_node_1.ContextInfo();
        contextInfo.name = "Test";
        contextInfo.description = "This is a test container";
        let references = pip_services4_components_node_1.References.fromTuples(new pip_services4_components_node_1.Descriptor("pip-services", "context-info", "default", "default", "1.0"), contextInfo, new pip_services4_components_node_1.Descriptor("pip-services", "counters", "prometheus", "default", "1.0"), counters, new pip_services4_components_node_1.Descriptor("pip-services", "metrics-controller", "prometheus", "default", "1.0"), controller);
        counters.setReferences(references);
        controller.setReferences(references);
        yield counters.open(null);
        yield controller.open(null);
    }));
    suiteTeardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield controller.close(null);
        yield counters.close(null);
    }));
    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createStringClient({ url: url });
    });
    test('Metrics', (done) => {
        counters.incrementOne('test.counter1');
        counters.stats('test.counter2', 2);
        counters.last('test.counter3', 3);
        counters.timestampNow('test.counter4');
        rest.get('/metrics', (err, req, res, result) => {
            assert.isNull(err);
            assert.isNotNull(result);
            assert.isTrue(res.statusCode < 400);
            assert.isTrue(result.length > 0);
            done();
        });
    });
    test('MetricsAndReset', (done) => {
        counters.incrementOne('test.counter1');
        counters.stats('test.counter2', 2);
        counters.last('test.counter3', 3);
        counters.timestampNow('test.counter4');
        rest.get('/metricsandreset', (err, req, res, result) => {
            assert.isNull(err);
            assert.isNotNull(result);
            assert.isTrue(res.statusCode < 400);
            assert.isTrue(result.length > 0);
            let counter1 = counters.get("test.counter1", pip_services4_observability_node_1.CounterType.Increment);
            let counter2 = counters.get("test.counter2", pip_services4_observability_node_1.CounterType.Statistics);
            let counter3 = counters.get("test.counter3", pip_services4_observability_node_1.CounterType.LastValue);
            let counter4 = counters.get("test.counter4", pip_services4_observability_node_1.CounterType.Timestamp);
            assert.isUndefined(counter1.count);
            assert.isUndefined(counter2.count);
            assert.isUndefined(counter3.last);
            assert.isUndefined(counter4.time);
            done();
        });
    });
});
//# sourceMappingURL=PrometheusMetricsService.test.js.map