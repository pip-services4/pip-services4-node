"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCassandraFactory = void 0;
/** @module build */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const CassandraConnection_1 = require("../connect/CassandraConnection");
/**
 * Creates Cassandra components by their descriptors.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[CassandraConnection]]
 */
class DefaultCassandraFactory extends pip_services4_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultCassandraFactory.CassandraConnectionDescriptor, CassandraConnection_1.CassandraConnection);
    }
}
exports.DefaultCassandraFactory = DefaultCassandraFactory;
DefaultCassandraFactory.CassandraConnectionDescriptor = new pip_services4_commons_node_1.Descriptor("pip-services", "connection", "cassandra", "*", "1.0");
//# sourceMappingURL=DefaultCassandraFactory.js.map