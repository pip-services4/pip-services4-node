"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubDummySchema = void 0;
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
class SubDummySchema extends pip_services4_data_node_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty("key", pip_services4_commons_node_1.TypeCode.String);
        this.withOptionalProperty("content", pip_services4_commons_node_1.TypeCode.String);
    }
}
exports.SubDummySchema = SubDummySchema;
//# sourceMappingURL=SubDummySchema.js.map