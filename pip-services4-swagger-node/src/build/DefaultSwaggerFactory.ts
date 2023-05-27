/** @module build */
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-components-node';

import { SwaggerController } from '../controllers/SwaggerController';

/**
 * Creates Swagger components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[HttpEndpoint]]
 * @see [[HeartbeatRestController]]
 * @see [[StatusRestController]] 
 */
export class DefaultSwaggerFactory extends Factory {
    private static readonly SwaggerControllerDescriptor: Descriptor = new Descriptor("pip-services", "swagger-controller", "*", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultSwaggerFactory.SwaggerControllerDescriptor, SwaggerController);
    }
}
