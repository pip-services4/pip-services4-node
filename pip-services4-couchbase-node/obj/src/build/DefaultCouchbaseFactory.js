"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCouchbaseFactory = void 0;
/** @module build */
const pip_services4_components_node_1 = require("pip-services4-components-node");
const CouchbaseConnection_1 = require("../connect/CouchbaseConnection");
/**
 * Creates Couchbase components by their descriptors.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[CouchbaseConnection]]
 */
class DefaultCouchbaseFactory extends pip_services4_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultCouchbaseFactory.CouchbaseConnectionDescriptor, CouchbaseConnection_1.CouchbaseConnection);
    }
}
exports.DefaultCouchbaseFactory = DefaultCouchbaseFactory;
DefaultCouchbaseFactory.CouchbaseConnectionDescriptor = new pip_services4_components_node_1.Descriptor("pip-services", "connection", "couchbase", "*", "1.0");
//# sourceMappingURL=DefaultCouchbaseFactory.js.map