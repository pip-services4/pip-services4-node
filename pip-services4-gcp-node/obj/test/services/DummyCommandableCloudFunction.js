"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandableHandler = exports.DummyCommandableCloudFunction = void 0;
const CommandableCloudFunction_1 = require("../../src/containers/CommandableCloudFunction");
const DummyFactory_1 = require("../DummyFactory");
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
class DummyCommandableCloudFunction extends CommandableCloudFunction_1.CommandableCloudFunction {
    constructor() {
        super("dummy", "Dummy commandable cloud function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyCommandableCloudFunction = DummyCommandableCloudFunction;
exports.commandableHandler = new DummyCommandableCloudFunction().getHandler();
//# sourceMappingURL=DummyCommandableCloudFunction.js.map