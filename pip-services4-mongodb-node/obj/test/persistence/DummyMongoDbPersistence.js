"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyMongoDbPersistence = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const IdentifiableMongoDbPersistence_1 = require("../../src/persistence/IdentifiableMongoDbPersistence");
class DummyMongoDbPersistence extends IdentifiableMongoDbPersistence_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('dummies');
    }
    defineSchema() {
        this.ensureIndex({ key: 1 });
    }
    getPageByFilter(context, filter, paging) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = {};
        if (key != null)
            filterCondition['key'] = key;
        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }
    getCountByFilter(context, filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
        let key = filter.getAsNullableString('key');
        let filterCondition = {};
        if (key != null)
            filterCondition['key'] = key;
        return super.getCountByFilter(context, filterCondition);
    }
}
exports.DummyMongoDbPersistence = DummyMongoDbPersistence;
//# sourceMappingURL=DummyMongoDbPersistence.js.map