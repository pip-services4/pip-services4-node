"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.DummyCommandableAzureFunction = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const CommandableAzureFunction_1 = require("../../src/containers/CommandableAzureFunction");
const DummyFactory_1 = require("../DummyFactory");
class DummyCommandableAzureFunction extends CommandableAzureFunction_1.CommandableAzureFunction {
    constructor() {
        super("dummy", "Dummy commandable Azure function");
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyCommandableAzureFunction = DummyCommandableAzureFunction;
exports.handler = new DummyCommandableAzureFunction().getHandler();
//# sourceMappingURL=DummyCommandableAzureFunction.js.map