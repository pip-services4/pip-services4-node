"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCassandraPersistence = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const IdentifiableCassandraPersistence_1 = require("../../src/persistence/IdentifiableCassandraPersistence");
class DummyCassandraPersistence extends IdentifiableCassandraPersistence_1.IdentifiableCassandraPersistence {
    constructor() {
        super('dummies', 'test');
    }
    defineSchema() {
        this.clearSchema();
        this.ensureSchema('CREATE TABLE ' + this.quotedTableName() + ' (id TEXT PRIMARY KEY, key TEXT, content TEXT)');
        this.ensureIndex('key', { key: 1 }, { unique: true });
    }
    getPageByFilter(context, filter, paging) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = '';
        if (key != null)
            filterCondition += "key='" + key + "'";
        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }
    getCountByFilter(context, filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = '';
        if (key != null)
            filterCondition += "key='" + key + "'";
        return super.getCountByFilter(context, filterCondition);
    }
}
exports.DummyCassandraPersistence = DummyCassandraPersistence;
//# sourceMappingURL=DummyCassandraPersistence.js.map