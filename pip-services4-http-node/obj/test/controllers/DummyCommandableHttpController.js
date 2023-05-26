"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableHttpController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const CommandableHttpController_1 = require("../../src/controllers/CommandableHttpController");
class DummyCommandableHttpController extends CommandableHttpController_1.CommandableHttpController {
    constructor() {
        super('dummy');
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }
    register() {
        if (!this._swaggerAuto && this._swaggerEnable) {
            this.registerOpenApiSpec("swagger yaml content");
        }
        super.register();
    }
}
exports.DummyCommandableHttpController = DummyCommandableHttpController;
//# sourceMappingURL=DummyCommandableHttpController.js.map