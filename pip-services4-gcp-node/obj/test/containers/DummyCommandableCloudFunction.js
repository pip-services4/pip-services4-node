"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableCloudFunction = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const CommandableCloudFunction_1 = require("../../src/containers/CommandableCloudFunction");
const DummyFactory_1 = require("../sample/DummyFactory");
class DummyCommandableCloudFunction extends CommandableCloudFunction_1.CommandableCloudFunction {
    constructor() {
        super("dummy", "Dummy GCP function");
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyCommandableCloudFunction = DummyCommandableCloudFunction;
//# sourceMappingURL=DummyCommandableCloudFunction.js.map