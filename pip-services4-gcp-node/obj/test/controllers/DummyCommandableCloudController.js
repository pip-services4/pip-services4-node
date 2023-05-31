"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableCloudController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const CommandableCloudFunctionController_1 = require("../../src/controllers/CommandableCloudFunctionController");
class DummyCommandableCloudController extends CommandableCloudFunctionController_1.CommandableCloudFunctionController {
    constructor() {
        super("dummies");
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }
}
exports.DummyCommandableCloudController = DummyCommandableCloudController;
//# sourceMappingURL=DummyCommandableCloudController.js.map