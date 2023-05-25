"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummySqlitePersistence = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const IdentifiableSqlitePersistence_1 = require("../../src/persistence/IdentifiableSqlitePersistence");
class DummySqlitePersistence extends IdentifiableSqlitePersistence_1.IdentifiableSqlitePersistence {
    constructor() {
        super('dummies');
    }
    defineSchema() {
        this.clearSchema();
        this.ensureSchema('CREATE TABLE "' + this._tableName + '" ("id" VARCHAR(32) PRIMARY KEY, "key" VARCHAR(50), "content" TEXT)');
        this.ensureIndex(this._tableName + '_key', { key: 1 }, { unique: true });
    }
    getPageByFilter(context, filter, paging) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = null;
        if (key != null)
            filterCondition = "\"key\"='" + key + "'";
        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }
    getCountByFilter(context, filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = null;
        if (key != null)
            filterCondition = "\"key\"='" + key + "'";
        return super.getCountByFilter(context, filterCondition);
    }
}
exports.DummySqlitePersistence = DummySqlitePersistence;
//# sourceMappingURL=DummySqlitePersistence.js.map