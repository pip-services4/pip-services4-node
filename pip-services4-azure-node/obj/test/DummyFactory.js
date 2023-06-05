"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyFactory = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const DummyService_1 = require("./DummyService");
const DummyAzureFunctionController_1 = require("./controllers/DummyAzureFunctionController");
const DummyCommandableAzureFunctionController_1 = require("./controllers/DummyCommandableAzureFunctionController");
class DummyFactory extends pip_services4_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(DummyFactory.ControllerDescriptor, DummyService_1.DummyService);
        this.registerAsType(DummyFactory.AzureFunctionControllerDescriptor, DummyAzureFunctionController_1.DummyAzureFunctionController);
        this.registerAsType(DummyFactory.CmdAzureFunctionControllerDescriptor, DummyCommandableAzureFunctionController_1.DummyCommandableAzureFunctionController);
    }
}
exports.DummyFactory = DummyFactory;
DummyFactory.Descriptor = new pip_services4_components_node_1.Descriptor("pip-services-dummies", "factory", "default", "default", "1.0");
DummyFactory.ControllerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services-dummies", "service", "default", "*", "1.0");
DummyFactory.AzureFunctionControllerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services-dummies", "controller", "azurefunc", "*", "1.0");
DummyFactory.CmdAzureFunctionControllerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services-dummies", "controller", "commandable-azurefunc", "*", "1.0");
//# sourceMappingURL=DummyFactory.js.map