"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyFactory = void 0;
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const DummyController_1 = require("./DummyController");
const DummyAzureFunctionService_1 = require("./services/DummyAzureFunctionService");
const DummyCommandableAzureFunctionService_1 = require("./services/DummyCommandableAzureFunctionService");
class DummyFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(DummyFactory.ControllerDescriptor, DummyController_1.DummyController);
        this.registerAsType(DummyFactory.AzureFunctionServiceDescriptor, DummyAzureFunctionService_1.DummyAzureFunctionService);
        this.registerAsType(DummyFactory.CmdAzureFunctionServiceDescriptor, DummyCommandableAzureFunctionService_1.DummyCommandableAzureFunctionService);
    }
}
exports.DummyFactory = DummyFactory;
DummyFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-dummies", "factory", "default", "default", "1.0");
DummyFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-dummies", "controller", "default", "*", "1.0");
DummyFactory.AzureFunctionServiceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-dummies", "service", "azurefunc", "*", "1.0");
DummyFactory.CmdAzureFunctionServiceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-dummies", "service", "commandable-azurefunc", "*", "1.0");
//# sourceMappingURL=DummyFactory.js.map