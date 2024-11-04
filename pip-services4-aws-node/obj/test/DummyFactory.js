"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyFactory = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const DummyService_1 = require("./DummyService");
const DummyLambdaController_1 = require("./controllers/DummyLambdaController");
const DummyCommandableLambdaController_1 = require("./controllers/DummyCommandableLambdaController");
const DummySingleService_1 = require("./DummySingleService");
const DummyFilePersistence_1 = require("./DummyFilePersistence");
class DummyFactory extends pip_services4_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(DummyFactory.FilePersistenceDescriptor, DummyFilePersistence_1.DummyFilePersistence);
        this.registerAsType(DummyFactory.ControllerDescriptor, DummyService_1.DummyService);
        this.registerAsType(DummyFactory.DummySingleServiceDescriptor, DummySingleService_1.DummySingleService);
        this.registerAsType(DummyFactory.LambdaControllerDescriptor, DummyLambdaController_1.DummyLambdaController);
        this.registerAsType(DummyFactory.CmdLambdaControllerDescriptor, DummyCommandableLambdaController_1.DummyCommandableLambdaController);
    }
}
exports.DummyFactory = DummyFactory;
DummyFactory.Descriptor = new pip_services4_components_node_1.Descriptor("pip-services-dummies", "factory", "default", "default", "1.0");
DummyFactory.FilePersistenceDescriptor = new pip_services4_components_node_1.Descriptor("pip-services-dummies", "persistence", "file", "*", "1.0");
DummyFactory.ControllerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services-dummies", "service", "default", "*", "1.0");
DummyFactory.DummySingleServiceDescriptor = new pip_services4_components_node_1.Descriptor("pip-services-dummies", "service", "single-service", "*", "1.0");
DummyFactory.LambdaControllerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services-dummies", "controller", "awslambda", "*", "1.0");
DummyFactory.CmdLambdaControllerDescriptor = new pip_services4_components_node_1.Descriptor("pip-services-dummies", "controller", "commandable-awslambda", "*", "1.0");
//# sourceMappingURL=DummyFactory.js.map