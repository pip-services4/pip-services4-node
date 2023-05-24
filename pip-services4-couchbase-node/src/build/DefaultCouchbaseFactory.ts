/** @module build */
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

import { CouchbaseConnection } from '../connect/CouchbaseConnection';

/**
 * Creates Couchbase components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[CouchbaseConnection]]
 */
export class DefaultCouchbaseFactory extends Factory {
    private static readonly CouchbaseConnectionDescriptor: Descriptor = new Descriptor("pip-services", "connection", "couchbase", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultCouchbaseFactory.CouchbaseConnectionDescriptor, CouchbaseConnection);
    }
}
