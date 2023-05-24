/** @module config */
import { ConfigParams } from 'pip-services4-commons-node';
import { ComponentConfig } from './ComponentConfig';
/**
 * Container configuration defined as a list of component configurations.
 *
 * @see [[ComponentConfig]]
 */
export declare class ContainerConfig extends Array<ComponentConfig> {
    /**
     * Creates a new instance of container configuration.
     *
     * @param components    (optional) a list of component configurations.
     */
    constructor(components?: ComponentConfig[]);
    /**
     * Creates a new ContainerConfig object filled with key-value pairs from specified object.
     * The value is converted into ConfigParams object which is used to create the object.
     *
     * @param value		an object with key-value pairs used to initialize a new ContainerConfig.
     * @returns			a new ContainerConfig object.
     *
     * @see [[fromConfig]]
     */
    static fromValue(value: any): ContainerConfig;
    /**
     * Creates a new ContainerConfig object based on configuration parameters.
     * Each section in the configuration parameters is converted into a component configuration.
     *
     * @param value		an object with key-value pairs used to initialize a new ContainerConfig.
     * @returns			a new ContainerConfig object.
     */
    static fromConfig(config: ConfigParams): ContainerConfig;
}
