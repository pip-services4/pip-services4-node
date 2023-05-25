/** @module build */
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

import { HttpEndpoint } from '../services/HttpEndpoint';
import { HeartbeatRestService } from '../services/HeartbeatRestService';
import { StatusRestService } from '../services/StatusRestService';

/**
 * Creates RPC components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[HttpEndpoint]]
 * @see [[HeartbeatRestService]]
 * @see [[StatusRestService]] 
 */
export class DefaultHttpFactory extends Factory {
    private static readonly HttpEndpointDescriptor: Descriptor = new Descriptor("pip-services", "endpoint", "http", "*", "1.0");
    private static readonly StatusServiceDescriptor = new Descriptor("pip-services", "status-service", "http", "*", "1.0");
    private static readonly HeartbeatServiceDescriptor = new Descriptor("pip-services", "heartbeat-service", "http", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultRpcFactory.HttpEndpointDescriptor, HttpEndpoint);
        this.registerAsType(DefaultRpcFactory.HeartbeatServiceDescriptor, HeartbeatRestService);
        this.registerAsType(DefaultRpcFactory.StatusServiceDescriptor, StatusRestService);
    }
}
