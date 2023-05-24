/** @module config */
import { Descriptor } from 'pip-services4-commons-node';
import { TypeDescriptor } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
/**
 * Configuration of a component inside a container.
 *
 * The configuration includes type information or descriptor,
 * and component configuration parameters.
 */
export declare class ComponentConfig {
    /**
     * Creates a new instance of the component configuration.
     *
     * @param descriptor    (optional) a components descriptor (locator).
     * @param type          (optional) a components type descriptor.
     * @param config        (optional) component configuration parameters.
     */
    constructor(descriptor?: Descriptor, type?: TypeDescriptor, config?: ConfigParams);
    descriptor: Descriptor;
    type: TypeDescriptor;
    config: ConfigParams;
    /**
     * Creates a new instance of ComponentConfig based on
     * section from container configuration.
     *
     * @param config    component parameters from container configuration
     * @returns a newly created ComponentConfig
     *
     * @throws ConfigException when neither component descriptor or type is found.
     */
    static fromConfig(config: ConfigParams): ComponentConfig;
}
