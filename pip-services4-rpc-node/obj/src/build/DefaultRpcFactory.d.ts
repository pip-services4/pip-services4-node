/** @module build */
import { Factory } from 'pip-services4-components-node';
/**
 * Creates RPC components by their descriptors.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[HttpEndpoint]]
 * @see [[HeartbeatRestService]]
 * @see [[StatusRestService]]
 */
export declare class DefaultRpcFactory extends Factory {
    private static readonly HttpEndpointDescriptor;
    private static readonly StatusServiceDescriptor;
    private static readonly HeartbeatServiceDescriptor;
    /**
     * Create a new instance of the factory.
     */
    constructor();
}
