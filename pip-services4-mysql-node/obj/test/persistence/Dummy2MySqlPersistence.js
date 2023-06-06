"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dummy2MySqlPersistence = void 0;
const pip_services4_data_node_1 = require("pip-services4-data-node");
const IdentifiableMySqlPersistence_1 = require("../../src/persistence/IdentifiableMySqlPersistence");
class Dummy2MySqlPersistence extends IdentifiableMySqlPersistence_1.IdentifiableMySqlPersistence {
    constructor() {
        super('dummies2');
        this._autoGenerateId = false;
    }
    defineSchema() {
        this.clearSchema();
        this.ensureSchema('CREATE TABLE `' + this._tableName + '` (id INTEGER PRIMARY KEY, `key` VARCHAR(50), `content` TEXT)');
        this.ensureIndex(this._tableName + '_key', { key: 1 }, { unique: true });
    }
    getPageByFilter(context, filter, paging) {
        const _super = Object.create(null, {
            getPageByFilter: { get: () => super.getPageByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            filter = filter || new pip_services4_data_node_1.FilterParams();
            let key = filter.getAsNullableString('key');
            let filterCondition = null;
            if (key != null) {
                filterCondition += "`key`='" + key + "'";
            }
            return _super.getPageByFilter.call(this, context, filterCondition, paging, null, null);
        });
    }
    getCountByFilter(context, filter) {
        const _super = Object.create(null, {
            getCountByFilter: { get: () => super.getCountByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            filter = filter || new pip_services4_data_node_1.FilterParams();
            let key = filter.getAsNullableString('key');
            let filterCondition = null;
            if (key != null) {
                filterCondition += "`key`='" + key + "'";
            }
            return yield _super.getCountByFilter.call(this, context, filterCondition);
        });
    }
}
exports.Dummy2MySqlPersistence = Dummy2MySqlPersistence;
//# sourceMappingURL=Dummy2MySqlPersistence.js.map