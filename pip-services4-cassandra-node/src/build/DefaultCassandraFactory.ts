/** @module build */
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

import { CassandraConnection } from '../connect/CassandraConnection';

/**
 * Creates Cassandra components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[CassandraConnection]]
 */
export class DefaultCassandraFactory extends Factory {
    private static readonly CassandraConnectionDescriptor: Descriptor = new Descriptor("pip-services", "connection", "cassandra", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultCassandraFactory.CassandraConnectionDescriptor, CassandraConnection);
    }
}
