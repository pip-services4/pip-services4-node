/** @module info */
import { Descriptor } from '../refer/Descriptor';
import { Factory } from '../build/Factory';
import { ContextInfo } from './ContextInfo';

/**
 * Creates information components by their descriptors.
 * 
 * @see [[IFactory]]
 * @see [[ContextInfo]]
 */
export class DefaultContextFactory extends Factory {
    private static readonly ContextInfoDescriptor: Descriptor = new Descriptor("pip-services", "context-info", "default", "*", "1.0");
    private static readonly ContainerInfoDescriptor: Descriptor = new Descriptor("pip-services", "container-info", "default", "*", "1.0");
    
    /**
     * Create a new instance of the factory.
     */
    public constructor() {
        super();
        this.registerAsType(DefaultContextFactory.ContextInfoDescriptor, ContextInfo);
        this.registerAsType(DefaultContextFactory.ContainerInfoDescriptor, ContextInfo);
    }
}
