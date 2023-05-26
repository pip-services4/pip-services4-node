"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerConfig = void 0;
/** @module config */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const ComponentConfig_1 = require("./ComponentConfig");
/**
 * Container configuration defined as a list of component configurations.
 *
 * @see [[ComponentConfig]]
 */
class ContainerConfig extends Array {
    /**
     * Creates a new instance of container configuration.
     *
     * @param components    (optional) a list of component configurations.
     */
    constructor(components) {
        super();
        if (components != null) {
            super.push(...components);
        }
    }
    /**
     * Creates a new ContainerConfig object filled with key-value pairs from specified object.
     * The value is converted into ConfigParams object which is used to create the object.
     *
     * @param value        an object with key-value pairs used to initialize a new ContainerConfig.
     * @returns            a new ContainerConfig object.
     *
     * @see [[fromConfig]]
     */
    static fromValue(value) {
        const config = pip_services4_components_node_1.ConfigParams.fromValue(value);
        return ContainerConfig.fromConfig(config);
    }
    /**
     * Creates a new ContainerConfig object based on configuration parameters.
     * Each section in the configuration parameters is converted into a component configuration.
     *
     * @param value        an object with key-value pairs used to initialize a new ContainerConfig.
     * @returns            a new ContainerConfig object.
     */
    static fromConfig(config) {
        const result = new ContainerConfig();
        if (config == null)
            return result;
        const names = config.getSectionNames();
        for (let i = 0; i < names.length; i++) {
            const componentConfig = config.getSection(names[i]);
            result.push(ComponentConfig_1.ComponentConfig.fromConfig(componentConfig));
        }
        return result;
    }
}
exports.ContainerConfig = ContainerConfig;
//# sourceMappingURL=ContainerConfig.js.map