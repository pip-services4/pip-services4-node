"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultPostgresFactory = void 0;
/** @module build */
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const PostgresConnection_1 = require("../connect/PostgresConnection");
/**
 * Creates Postgres components by their descriptors.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[PostgresConnection]]
 */
class DefaultPostgresFactory extends pip_services3_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultPostgresFactory.PostgresConnectionDescriptor, PostgresConnection_1.PostgresConnection);
    }
}
exports.DefaultPostgresFactory = DefaultPostgresFactory;
DefaultPostgresFactory.PostgresConnectionDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "connection", "postgres", "*", "1.0");
//# sourceMappingURL=DefaultPostgresFactory.js.map