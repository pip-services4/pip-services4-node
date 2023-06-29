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
exports.DummyGrpcClient = void 0;
const GrpcClient_1 = require("../../src/clients/GrpcClient");
const pip_services4_components_node_1 = require("pip-services4-components-node");
class DummyGrpcClient extends GrpcClient_1.GrpcClient {
    constructor() {
        super(__dirname + "../../../../test/protos/dummies.proto", "dummies.Dummies");
    }
    getDummies(context, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            this.instrument(context, 'dummy.get_page_by_filter');
            return yield this.call('get_dummies', context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, {
                filter: filter,
                paging: paging
            });
        });
    }
    getDummyById(context, dummyId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.instrument(context, 'dummy.get_one_by_id');
            let result = yield this.call('get_dummy_by_id', context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, {
                dummy_id: dummyId
            });
            if (result && result.id == "" && result.key == "") {
                result = null;
            }
            return result;
        });
    }
    createDummy(context, dummy) {
        return __awaiter(this, void 0, void 0, function* () {
            this.instrument(context, 'dummy.create');
            let result = yield this.call('create_dummy', context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, {
                dummy: dummy
            });
            if (result && result.id == "" && result.key == "") {
                result = null;
            }
            return result;
        });
    }
    updateDummy(context, dummy) {
        return __awaiter(this, void 0, void 0, function* () {
            this.instrument(context, 'dummy.update');
            let result = yield this.call('update_dummy', context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, {
                dummy: dummy
            });
            if (result && result.id == "" && result.key == "") {
                result = null;
            }
            return result;
        });
    }
    deleteDummy(context, dummyId) {
        return __awaiter(this, void 0, void 0, function* () {
            this.instrument(context, 'dummy.delete_by_id');
            let result = yield this.call('delete_dummy_by_id', context != null ? pip_services4_components_node_1.ContextResolver.getTraceId(context) : null, {
                dummy_id: dummyId
            });
            if (result && result.id == "" && result.key == "") {
                result = null;
            }
            return result;
        });
    }
}
exports.DummyGrpcClient = DummyGrpcClient;
//# sourceMappingURL=DummyGrpcClient.js.map