"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentConfig = void 0;
/** @module config */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_commons_node_3 = require("pip-services4-commons-node");
/**
 * Configuration of a component inside a container.
 *
 * The configuration includes type information or descriptor,
 * and component configuration parameters.
 */
class ComponentConfig {
    /**
     * Creates a new instance of the component configuration.
     *
     * @param descriptor    (optional) a components descriptor (locator).
     * @param type          (optional) a components type descriptor.
     * @param config        (optional) component configuration parameters.
     */
    constructor(descriptor, type, config) {
        this.descriptor = null;
        this.type = null;
        this.config = null;
        this.descriptor = descriptor;
        this.type = type;
        this.config = config;
    }
    /**
     * Creates a new instance of ComponentConfig based on
     * section from container configuration.
     *
     * @param config    component parameters from container configuration
     * @returns a newly created ComponentConfig
     *
     * @throws ConfigException when neither component descriptor or type is found.
     */
    static fromConfig(config) {
        let descriptor = pip_services3_commons_node_1.Descriptor.fromString(config.getAsNullableString("descriptor"));
        let type = pip_services3_commons_node_2.TypeDescriptor.fromString(config.getAsNullableString("type"));
        if (descriptor == null && type == null) {
            throw new pip_services3_commons_node_3.ConfigException(null, "BAD_CONFIG", "Component configuration must have descriptor or type");
        }
        return new ComponentConfig(descriptor, type, config);
    }
}
exports.ComponentConfig = ComponentConfig;
//# sourceMappingURL=ComponentConfig.js.map