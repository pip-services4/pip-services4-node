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
exports.DummyService = void 0;
const DummyCommandSet_1 = require("./DummyCommandSet");
const pip_services4_data_node_1 = require("pip-services4-data-node");
class DummyService {
    constructor() {
        this._entities = [];
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new DummyCommandSet_1.DummyCommandSet(this);
        return this._commandSet;
    }
    getPageByFilter(context, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            filter = filter != null ? filter : new pip_services4_data_node_1.FilterParams();
            let key = filter.getAsNullableString("key");
            paging = paging != null ? paging : new pip_services4_data_node_1.PagingParams();
            let skip = paging.getSkip(0);
            let take = paging.getTake(100);
            let result = [];
            for (var i = 0; i < this._entities.length; i++) {
                let entity = this._entities[i];
                if (key != null && key != entity.key)
                    continue;
                skip--;
                if (skip >= 0)
                    continue;
                take--;
                if (take < 0)
                    break;
                result.push(entity);
            }
            return new pip_services4_data_node_1.DataPage(result);
        });
    }
    getOneById(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const entity of this._entities) {
                if (id == entity.id) {
                    return entity;
                }
            }
            return null;
        });
    }
    create(context, entity) {
        return __awaiter(this, void 0, void 0, function* () {
            if (entity.id == null) {
                entity.id = pip_services4_data_node_1.IdGenerator.nextLong();
                this._entities.push(entity);
            }
            return entity;
        });
    }
    update(context, newEntity) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < this._entities.length; index++) {
                let entity = this._entities[index];
                if (entity.id == newEntity.id) {
                    this._entities[index] = newEntity;
                    return newEntity;
                }
            }
            return null;
        });
    }
    deleteById(context, id) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let index = 0; index < this._entities.length; index++) {
                let entity = this._entities[index];
                if (entity.id == id) {
                    this._entities.splice(index, 1);
                    return entity;
                }
            }
            return null;
        });
    }
}
exports.DummyService = DummyService;
//# sourceMappingURL=DummyService.js.map