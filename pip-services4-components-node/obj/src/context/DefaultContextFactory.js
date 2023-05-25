"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultContextFactory = void 0;
/** @module info */
const Descriptor_1 = require("../refer/Descriptor");
const Factory_1 = require("../build/Factory");
const ContextInfo_1 = require("./ContextInfo");
/**
 * Creates information components by their descriptors.
 *
 * @see [[IFactory]]
 * @see [[ContextInfo]]
 */
class DefaultContextFactory extends Factory_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultContextFactory.ContextInfoDescriptor, ContextInfo_1.ContextInfo);
        this.registerAsType(DefaultContextFactory.ContainerInfoDescriptor, ContextInfo_1.ContextInfo);
    }
}
exports.DefaultContextFactory = DefaultContextFactory;
DefaultContextFactory.ContextInfoDescriptor = new Descriptor_1.Descriptor("pip-services", "context-info", "default", "*", "1.0");
DefaultContextFactory.ContainerInfoDescriptor = new Descriptor_1.Descriptor("pip-services", "container-info", "default", "*", "1.0");
//# sourceMappingURL=DefaultContextFactory.js.map