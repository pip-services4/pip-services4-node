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
exports.DummyMemoryPersistence = void 0;
const pip_services4_data_node_1 = require("pip-services4-data-node");
const pip_services4_persistence_node_1 = require("pip-services4-persistence-node");
class DummyMemoryPersistence extends pip_services4_persistence_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
    }
    composeFilter(filter) {
        filter = filter != null ? filter : new pip_services4_data_node_1.FilterParams();
        let key = filter.getAsNullableString("key");
        return (item) => {
            if (key != null && item.key != key)
                return false;
            return true;
        };
    }
    getPageByFilter(context, filter, paging) {
        const _super = Object.create(null, {
            getPageByFilter: { get: () => super.getPageByFilter }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getPageByFilter.call(this, context, this.composeFilter(filter), paging, null, null);
        });
    }
}
exports.DummyMemoryPersistence = DummyMemoryPersistence;
//# sourceMappingURL=DummyMemoryPersistence.js.map