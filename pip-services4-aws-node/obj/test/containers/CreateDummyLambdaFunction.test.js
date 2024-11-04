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
const assert = require("chai").assert;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const DummyFilePersistence_1 = require("../DummyFilePersistence");
const DummySingleService_1 = require("../DummySingleService");
const CreateDummyLambdaFunction_1 = require("./CreateDummyLambdaFunction");
suite("CreateDummyLambdaSingleFunction.test", () => {
    let DUMMY1 = { id: null, key: "Key 1", content: "Content 1" };
    let DUMMY2 = { id: null, key: "Key 2", content: "Content 2" };
    let createLambda;
    let persistence;
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        persistence = new DummyFilePersistence_1.DummyFilePersistence("./data/dummies.json");
        let service = new DummySingleService_1.DummySingleService();
        const references = pip_services4_components_node_1.References.fromTuples(new pip_services4_components_node_1.Descriptor("pip-services-dummies", "persistence", "file", "*", "1.0"), persistence, new pip_services4_components_node_1.Descriptor("pip-services-dummies", "service", "single-service", "*", "1.0"), service);
        service.setReferences(references);
        let config = pip_services4_components_node_1.ConfigParams.fromTuples("logger.descriptor", "pip-services:logger:console:default:1.0", "service.descriptor", "pip-services-dummies:service:single-service:default:1.0", "persistence.descriptor", "pip-services-dummies:persistence:file:default:1.0", "persistence.path", "./data/dummies.json");
        service.configure(config);
        createLambda = new CreateDummyLambdaFunction_1.CreateDummyLambdaFunction();
        createLambda.configure(config);
        createLambda.setReferences(references);
        yield persistence.open(null);
        yield persistence.clear(null);
        yield persistence.close(null);
        yield createLambda.open(null);
    }));
    suiteTeardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield createLambda.close(null);
    }));
    test("Create Dummies Operations", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create one dummy
        let dummy1 = yield createLambda.act({
            dummy: DUMMY1,
        });
        assert.isObject(dummy1);
        assert.equal(dummy1.content, DUMMY1.content);
        assert.equal(dummy1.key, DUMMY1.key);
        // Create another dummy
        let dummy2 = yield createLambda.act({
            dummy: DUMMY2,
        });
        assert.isObject(dummy2);
        assert.equal(dummy2.content, DUMMY2.content);
        assert.equal(dummy2.key, DUMMY2.key);
    }));
});
//# sourceMappingURL=CreateDummyLambdaFunction.test.js.map