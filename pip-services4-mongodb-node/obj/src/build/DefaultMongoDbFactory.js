"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultMongoDbFactory = void 0;
/** @module build */
const pip_services3_components_node_1 = require("pip-services4-components-node");
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const MongoDbConnection_1 = require("../connect/MongoDbConnection");
/**
 * Creates MongoDb components by their descriptors.
 *
 * @see [[https://pip-services4-node.github.io/pip-services4-components-node/classes/build.factory.html Factory]]
 * @see [[MongoDbConnection]]
 */
class DefaultMongoDbFactory extends pip_services3_components_node_1.Factory {
    /**
     * Create a new instance of the factory.
     */
    constructor() {
        super();
        this.registerAsType(DefaultMongoDbFactory.MongoDbConnectionDescriptor, MongoDbConnection_1.MongoDbConnection);
    }
}
exports.DefaultMongoDbFactory = DefaultMongoDbFactory;
DefaultMongoDbFactory.MongoDbConnectionDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services", "connection", "mongodb", "*", "1.0");
//# sourceMappingURL=DefaultMongoDbFactory.js.map