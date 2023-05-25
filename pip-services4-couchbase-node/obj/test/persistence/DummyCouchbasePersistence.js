"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCouchbasePersistence = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const IdentifiableCouchbasePersistence_1 = require("../../src/persistence/IdentifiableCouchbasePersistence");
class DummyCouchbasePersistence extends IdentifiableCouchbasePersistence_1.IdentifiableCouchbasePersistence {
    constructor() {
        super('test', 'dummies');
    }
    getPageByFilter(context, filter, paging) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = null;
        if (key != null) {
            filterCondition = "key='" + key + "'";
        }
        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }
    getCountByFilter(context, filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = null;
        if (key != null) {
            filterCondition = "key='" + key + "'";
        }
        return super.getCountByFilter(context, filterCondition);
    }
}
exports.DummyCouchbasePersistence = DummyCouchbasePersistence;
//# sourceMappingURL=DummyCouchbasePersistence.js.map