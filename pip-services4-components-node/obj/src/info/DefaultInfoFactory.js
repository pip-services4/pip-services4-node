"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultInfoFactory = void 0;
/** @module info */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const Factory_1 = require("../build/Factory");
const ContextInfo_1 = require("./ContextInfo");
/**
 * Creates information components by their descriptors.
 *
 * @see [[IFactory]]
 * @see [[ContextInfo]]
 */
class DefaultInfoFactory extends Factory_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultInfoFactory.ContextInfoDescriptor, ContextInfo_1.ContextInfo);
        this.registerAsType(DefaultInfoFactory.ContainerInfoDescriptor, ContextInfo_1.ContextInfo);
    }
}
exports.DefaultInfoFactory = DefaultInfoFactory;
DefaultInfoFactory.ContextInfoDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "context-info", "default", "*", "1.0");
DefaultInfoFactory.ContainerInfoDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "container-info", "default", "*", "1.0");
//# sourceMappingURL=DefaultInfoFactory.js.map