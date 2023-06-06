"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultSqliteFactory = void 0;
/** @module build */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const SqliteConnection_1 = require("../connect/SqliteConnection");
/**
 * Creates Sqlite components by their descriptors.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[SqliteConnection]]
 */
class DefaultSqliteFactory extends pip_services4_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultSqliteFactory.SqliteConnectionDescriptor, SqliteConnection_1.SqliteConnection);
    }
}
exports.DefaultSqliteFactory = DefaultSqliteFactory;
DefaultSqliteFactory.SqliteConnectionDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "connection", "sqlite", "*", "1.0");
//# sourceMappingURL=DefaultSqliteFactory.js.map