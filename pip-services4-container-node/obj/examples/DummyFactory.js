"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyFactory = void 0;
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const DummyController_1 = require("./DummyController");
class DummyFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(DummyFactory.ControllerDescriptor, DummyController_1.DummyController);
    }
}
exports.DummyFactory = DummyFactory;
DummyFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-dummies", "controller", "default", "*", "1.0");
//# sourceMappingURL=DummyFactory.js.map