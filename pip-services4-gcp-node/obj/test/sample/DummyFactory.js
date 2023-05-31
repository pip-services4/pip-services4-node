"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyFactory = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const DummyService_1 = require("./DummyService");
const DummyCloudController_1 = require("../controllers/DummyCloudController");
const DummyCommandableCloudController_1 = require("../controllers/DummyCommandableCloudController");
class DummyFactory extends pip_services4_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(DummyFactory.ServiceDescriptor, DummyService_1.DummyService);
        this.registerAsType(DummyFactory.CloudFunctionControllerDescriptor, DummyCloudController_1.DummyCloudController);
        this.registerAsType(DummyFactory.CmdCloudFunctionControllerDescriptor, DummyCommandableCloudController_1.DummyCommandableCloudController);
    }
}
exports.DummyFactory = DummyFactory;
DummyFactory.Descriptor = new pip_services4_components_node_2.Descriptor("pip-services-dummies", "factory", "default", "default", "1.0");
DummyFactory.ServiceDescriptor = new pip_services4_components_node_2.Descriptor("pip-services-dummies", "service", "default", "*", "1.0");
DummyFactory.CloudFunctionControllerDescriptor = new pip_services4_components_node_2.Descriptor("pip-services-dummies", "controller", "cloudfunc", "*", "1.0");
DummyFactory.CmdCloudFunctionControllerDescriptor = new pip_services4_components_node_2.Descriptor("pip-services-dummies", "controller", "commandable-cloudfunc", "*", "1.0");
//# sourceMappingURL=DummyFactory.js.map