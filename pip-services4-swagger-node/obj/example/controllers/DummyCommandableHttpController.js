"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableHttpController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_http_node_1 = require("pip-services4-http-node");
class DummyCommandableHttpController extends pip_services4_http_node_1.CommandableHttpController {
    constructor() {
        super('dummies2');
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }
    register() {
        // if (!this._swaggerAuto && this._swaggerEnabled) {
        //     this.registerOpenApiSpec("swagger yaml content");
        // }
        super.register();
    }
}
exports.DummyCommandableHttpController = DummyCommandableHttpController;
//# sourceMappingURL=DummyCommandableHttpController.js.map