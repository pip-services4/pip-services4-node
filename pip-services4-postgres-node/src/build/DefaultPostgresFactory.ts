/** @module build */
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

import { PostgresConnection } from '../connect/PostgresConnection';

/**
 * Creates Postgres components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[PostgresConnection]]
 */
export class DefaultPostgresFactory extends Factory {
    private static readonly PostgresConnectionDescriptor: Descriptor = new Descriptor("pip-services", "connection", "postgres", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultPostgresFactory.PostgresConnectionDescriptor, PostgresConnection);
    }
}
