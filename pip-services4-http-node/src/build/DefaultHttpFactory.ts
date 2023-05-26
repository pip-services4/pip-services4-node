/** @module build */
import { Descriptor, Factory } from 'pip-services4-components-node';


import { HttpEndpoint } from '../controllers/HttpEndpoint';
import { HeartbeatRestController } from '../controllers/HeartbeatRestController';
import { StatusRestController } from '../controllers/StatusRestController';

/**
 * Creates RPC components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[HttpEndpoint]]
 * @see [[HeartbeatRestController]]
 * @see [[StatusRestController]] 
 */
export class DefaultHttpFactory extends Factory {
    private static readonly HttpEndpointDescriptor: Descriptor = new Descriptor("pip-services", "endpoint", "http", "*", "1.0");
    private static readonly StatusServiceDescriptor = new Descriptor("pip-services", "status-controller", "http", "*", "1.0");
    private static readonly HeartbeatServiceDescriptor = new Descriptor("pip-services", "heartbeat-controller", "http", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultHttpFactory.HttpEndpointDescriptor, HttpEndpoint);
        this.registerAsType(DefaultHttpFactory.HeartbeatServiceDescriptor, HeartbeatRestController);
        this.registerAsType(DefaultHttpFactory.StatusServiceDescriptor, StatusRestController);
    }
}
