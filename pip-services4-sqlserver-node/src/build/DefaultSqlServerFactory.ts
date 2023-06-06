/** @module build */
import { Descriptor, Factory } from 'pip-services4-components-node';

import { SqlServerConnection } from '../connect/SqlServerConnection';

/**
 * Creates SqlServer components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[SqlServerConnection]]
 */
export class DefaultSqlServerFactory extends Factory {
    private static readonly SqlServerConnectionDescriptor: Descriptor = new Descriptor("pip-services", "connection", "sqlserver", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultSqlServerFactory.SqlServerConnectionDescriptor, SqlServerConnection);
    }
}
