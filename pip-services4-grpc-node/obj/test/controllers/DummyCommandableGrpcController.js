"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableGrpcController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const CommandableGrpcController_1 = require("../../src/controllers/CommandableGrpcController");
class DummyCommandableGrpcController extends CommandableGrpcController_1.CommandableGrpcController {
    constructor() {
        super('dummy');
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }
}
exports.DummyCommandableGrpcController = DummyCommandableGrpcController;
//# sourceMappingURL=DummyCommandableGrpcController.js.map