"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubDummySchema = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
class SubDummySchema extends pip_services3_commons_node_2.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty("key", pip_services3_commons_node_1.TypeCode.String);
        this.withOptionalProperty("content", pip_services3_commons_node_1.TypeCode.String);
    }
}
exports.SubDummySchema = SubDummySchema;
//# sourceMappingURL=SubDummySchema.js.map