"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerConfig = void 0;
/** @module config */
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
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
     * @param value		an object with key-value pairs used to initialize a new ContainerConfig.
     * @returns			a new ContainerConfig object.
     *
     * @see [[fromConfig]]
     */
    static fromValue(value) {
        let config = pip_services3_commons_node_1.ConfigParams.fromValue(value);
        return ContainerConfig.fromConfig(config);
    }
    /**
     * Creates a new ContainerConfig object based on configuration parameters.
     * Each section in the configuration parameters is converted into a component configuration.
     *
     * @param value		an object with key-value pairs used to initialize a new ContainerConfig.
     * @returns			a new ContainerConfig object.
     */
    static fromConfig(config) {
        let result = new ContainerConfig();
        if (config == null)
            return result;
        let names = config.getSectionNames();
        for (let i = 0; i < names.length; i++) {
            let componentConfig = config.getSection(names[i]);
            result.push(ComponentConfig_1.ComponentConfig.fromConfig(componentConfig));
        }
        return result;
    }
}
exports.ContainerConfig = ContainerConfig;
//# sourceMappingURL=ContainerConfig.js.map