"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummySqlServerPersistence = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const IdentifiableSqlServerPersistence_1 = require("../../src/persistence/IdentifiableSqlServerPersistence");
class DummySqlServerPersistence extends IdentifiableSqlServerPersistence_1.IdentifiableSqlServerPersistence {
    constructor() {
        super('dummies');
    }
    defineSchema() {
        this.clearSchema();
        this.ensureSchema('CREATE TABLE [' + this._tableName + '] ([id] VARCHAR(32) PRIMARY KEY, [key] VARCHAR(50), [content] VARCHAR(MAX))');
        this.ensureIndex(this._tableName + '_key', { key: 1 }, { unique: true });
    }
    getPageByFilter(context, filter, paging) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = null;
        if (key != null) {
            filterCondition += "[key]='" + key + "'";
        }
        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }
    getCountByFilter(context, filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = null;
        if (key != null) {
            filterCondition += "[key]='" + key + "'";
        }
        return super.getCountByFilter(context, filterCondition);
    }
}
exports.DummySqlServerPersistence = DummySqlServerPersistence;
//# sourceMappingURL=DummySqlServerPersistence.js.map