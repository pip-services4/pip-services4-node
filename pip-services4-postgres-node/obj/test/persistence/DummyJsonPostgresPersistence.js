"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyJsonPostgresPersistence = void 0;
const pip_services4_data_node_1 = require("pip-services4-data-node");
const IdentifiableJsonPostgresPersistence_1 = require("../../src/persistence/IdentifiableJsonPostgresPersistence");
class DummyJsonPostgresPersistence extends IdentifiableJsonPostgresPersistence_1.IdentifiableJsonPostgresPersistence {
    constructor() {
        super('dummies_json');
    }
    defineSchema() {
        this.clearSchema();
        this.ensureTable();
        this.ensureIndex(this._tableName + '_json_key', { "(data->>'key')": 1 }, { unique: true });
    }
    getPageByFilter(context, filter, paging) {
        filter = filter || new pip_services4_data_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = "";
        if (key != null)
            filterCondition += "data->>'key'='" + key + "'";
        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }
    getCountByFilter(context, filter) {
        filter = filter || new pip_services4_data_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = "";
        if (key != null)
            filterCondition += "data->>'key'='" + key + "'";
        return super.getCountByFilter(context, filterCondition);
    }
}
exports.DummyJsonPostgresPersistence = DummyJsonPostgresPersistence;
//# sourceMappingURL=DummyJsonPostgresPersistence.js.map