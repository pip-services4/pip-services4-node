"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyFactory = void 0;
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const DummyController_1 = require("./DummyController");
const DummyCloudFunctionService_1 = require("./services/DummyCloudFunctionService");
const DummyCommandableCloudFunctionService_1 = require("./services/DummyCommandableCloudFunctionService");
class DummyFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(DummyFactory.ControllerDescriptor, DummyController_1.DummyController);
        this.registerAsType(DummyFactory.CloudFunctionServiceDescriptor, DummyCloudFunctionService_1.DummyCloudFunctionService);
        this.registerAsType(DummyFactory.CmdCloudFunctionServiceDescriptor, DummyCommandableCloudFunctionService_1.DummyCommandableCloudFunctionService);
    }
}
exports.DummyFactory = DummyFactory;
DummyFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-dummies", "factory", "default", "default", "1.0");
DummyFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-dummies", "controller", "default", "*", "1.0");
DummyFactory.CloudFunctionServiceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-dummies", "service", "cloudfunc", "*", "1.0");
DummyFactory.CmdCloudFunctionServiceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-dummies", "service", "commandable-cloudfunc", "*", "1.0");
//# sourceMappingURL=DummyFactory.js.map