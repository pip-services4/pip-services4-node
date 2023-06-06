"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyPostgresPersistence = void 0;
const pip_services4_data_node_1 = require("pip-services4-data-node");
const IdentifiablePostgresPersistence_1 = require("../../src/persistence/IdentifiablePostgresPersistence");
class DummyPostgresPersistence extends IdentifiablePostgresPersistence_1.IdentifiablePostgresPersistence {
    constructor() {
        super('dummies');
    }
    defineSchema() {
        this.clearSchema();
        this.ensureSchema('CREATE TABLE ' + this._tableName + ' (id TEXT PRIMARY KEY, key TEXT, content TEXT)');
        this.ensureIndex(this._tableName + '_key', { key: 1 }, { unique: true });
    }
    getPageByFilter(context, filter, paging) {
        filter = filter || new pip_services4_data_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = "";
        if (key != null)
            filterCondition += "key='" + key + "'";
        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }
    getCountByFilter(context, filter) {
        filter = filter || new pip_services4_data_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = "";
        if (key != null)
            filterCondition += "key='" + key + "'";
        return super.getCountByFilter(context, filterCondition);
    }
}
exports.DummyPostgresPersistence = DummyPostgresPersistence;
//# sourceMappingURL=DummyPostgresPersistence.js.map