/** @module build */
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

import { MongoDbConnection } from '../connect/MongoDbConnection';

/**
 * Creates MongoDb components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[MongoDbConnection]]
 */
export class DefaultMongoDbFactory extends Factory {
    private static readonly MongoDbConnectionDescriptor: Descriptor = new Descriptor("pip-services", "connection", "mongodb", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultMongoDbFactory.MongoDbConnectionDescriptor, MongoDbConnection);
    }
}
