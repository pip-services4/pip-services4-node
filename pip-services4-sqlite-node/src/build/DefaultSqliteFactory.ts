/** @module build */
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

import { SqliteConnection } from '../connect/SqliteConnection';

/**
 * Creates Sqlite components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[SqliteConnection]]
 */
export class DefaultSqliteFactory extends Factory {
    private static readonly SqliteConnectionDescriptor: Descriptor = new Descriptor("pip-services", "connection", "sqlite", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultSqliteFactory.SqliteConnectionDescriptor, SqliteConnection);
    }
}
