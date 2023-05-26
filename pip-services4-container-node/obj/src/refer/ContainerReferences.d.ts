import { ContainerConfig } from '../config/ContainerConfig';
import { ManagedReferences } from './ManagedReferences';
/**
 * Container managed references that can be created from container configuration.
 *
 * @see [[ManagedReferences]]
 */
export declare class ContainerReferences extends ManagedReferences {
    /**
     * Puts components into the references from container configuration.
     *
     * @param   config  a container configuration with information of components to be added.
     *
     * @throws CreateException when one of component cannot be created.
     */
    putFromConfig(config: ContainerConfig): void;
}
