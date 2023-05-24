/** @module build */
import { Factory } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-commons-node';

import { MySqlConnection } from '../connect/MySqlConnection';

/**
 * Creates MySql components by their descriptors.
 * 
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[MySqlConnection]]
 */
export class DefaultMySqlFactory extends Factory {
    private static readonly MySqlConnectionDescriptor: Descriptor = new Descriptor("pip-services", "connection", "mysql", "*", "1.0");

    /**
	 * Create a new instance of the factory.
	 */
    public constructor() {
        super();
        this.registerAsType(DefaultMySqlFactory.MySqlConnectionDescriptor, MySqlConnection);
    }
}
