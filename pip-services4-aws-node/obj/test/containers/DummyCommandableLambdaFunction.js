"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.DummyCommandableLambdaFunction = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const CommandableLambdaFunction_1 = require("../../src/containers/CommandableLambdaFunction");
const DummyFactory_1 = require("../DummyFactory");
class DummyCommandableLambdaFunction extends CommandableLambdaFunction_1.CommandableLambdaFunction {
    constructor() {
        super("dummy", "Dummy lambda function");
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyCommandableLambdaFunction = DummyCommandableLambdaFunction;
exports.handler = new DummyCommandableLambdaFunction().getHandler();
//# sourceMappingURL=DummyCommandableLambdaFunction.js.map