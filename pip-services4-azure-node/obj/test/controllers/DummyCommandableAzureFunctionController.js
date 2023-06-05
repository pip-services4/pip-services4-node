"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableAzureFunctionController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const CommandableAzureFunctionController_1 = require("../../src/controllers/CommandableAzureFunctionController");
class DummyCommandableAzureFunctionController extends CommandableAzureFunctionController_1.CommandableAzureFunctionController {
    constructor() {
        super("dummies");
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }
}
exports.DummyCommandableAzureFunctionController = DummyCommandableAzureFunctionController;
//# sourceMappingURL=DummyCommandableAzureFunctionController.js.map