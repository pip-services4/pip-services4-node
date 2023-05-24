"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummySchema = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
class DummySchema extends pip_services3_commons_node_2.ObjectSchema {
    constructor() {
        super();
        this.withOptionalProperty("id", pip_services3_commons_node_1.TypeCode.String);
        this.withRequiredProperty("key", pip_services3_commons_node_1.TypeCode.String);
        this.withOptionalProperty("content", pip_services3_commons_node_1.TypeCode.String);
    }
}
exports.DummySchema = DummySchema;
//# sourceMappingURL=DummySchema.js.map