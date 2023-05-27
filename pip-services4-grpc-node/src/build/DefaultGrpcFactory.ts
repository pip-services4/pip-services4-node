/** @module build */
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-components-node';

import { GrpcEndpoint } from '../controllers/GrpcEndpoint';

/**
 * Creates GRPC components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[GrpcEndpoint]]
 */
export class DefaultGrpcFactory extends Factory {
    private static readonly GrpcEndpointDescriptor: Descriptor = new Descriptor("pip-services", "endpoint", "grpc", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultGrpcFactory.GrpcEndpointDescriptor, GrpcEndpoint);
    }
}
