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
const pip_services4_data_node_1 = require("pip-services4-data-node");
const DummyFilePersistence_1 = require("../DummyFilePersistence");
const DummySingleService_1 = require("../DummySingleService");
const GetDummiesLambdaFunction_1 = require("./GetDummiesLambdaFunction");
suite("GetDummiesLambdaSingleFunction.test", () => {
    let getLambda;
    let persistence;
    suiteSetup(() => __awaiter(void 0, void 0, void 0, function* () {
        persistence = new DummyFilePersistence_1.DummyFilePersistence("./data/dummies.json");
        persistence.configure(pip_services4_components_node_1.ConfigParams.fromTuples("path", "./data/dummies.json"));
        let service = new DummySingleService_1.DummySingleService();
        const references = pip_services4_components_node_1.References.fromTuples(new pip_services4_components_node_1.Descriptor("pip-services-dummies", "persistence", "file", "*", "1.0"), persistence, new pip_services4_components_node_1.Descriptor("pip-services-dummies", "service", "single-service", "*", "1.0"), service);
        service.setReferences(references);
        let config = pip_services4_components_node_1.ConfigParams.fromTuples("logger.descriptor", "pip-services:logger:console:default:1.0", "service.descriptor", "pip-services-dummies:service:single-service:default:1.0", "persistence.descriptor", "pip-services-dummies:persistence:file:default:1.0", "persistence.path", "./data/dummies.json");
        service.configure(config);
        getLambda = new GetDummiesLambdaFunction_1.GetDummiesLambdaFunction();
        getLambda.configure(config);
        getLambda.setReferences(references);
        yield getLambda.open(null);
    }));
    suiteTeardown(() => __awaiter(void 0, void 0, void 0, function* () {
        yield getLambda.close(null);
    }));
    test("Get Dummies Operations", () => __awaiter(void 0, void 0, void 0, function* () {
        // Get all dummies
        const page = yield getLambda.act({
            filter: new pip_services4_data_node_1.FilterParams(),
        });
        assert.isObject(page);
        assert.lengthOf(page.data, 2);
    }));
});
//# sourceMappingURL=GetDummiesLambdaFunction.test.js.map