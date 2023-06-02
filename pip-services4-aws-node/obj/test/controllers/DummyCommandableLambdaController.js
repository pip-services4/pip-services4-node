"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableLambdaController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const CommandableLambdaController_1 = require("../../src/controllers/CommandableLambdaController");
class DummyCommandableLambdaController extends CommandableLambdaController_1.CommandableLambdaController {
    constructor() {
        super("dummies");
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }
}
exports.DummyCommandableLambdaController = DummyCommandableLambdaController;
//# sourceMappingURL=DummyCommandableLambdaController.js.map