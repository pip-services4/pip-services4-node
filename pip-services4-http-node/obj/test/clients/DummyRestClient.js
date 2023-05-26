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
exports.DummyRestClient = void 0;
const RestClient_1 = require("../../src/clients/RestClient");
class DummyRestClient extends RestClient_1.RestClient {
    getDummies(context, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = {};
            this.addFilterParams(params, filter);
            this.addPagingParams(params, paging);
            let timing = this.instrument(context, 'dummy.get_page_by_filter');
            try {
                return yield this.call('get', '/dummies', context, params);
            }
            catch (ex) {
                timing.endFailure(ex);
            }
            finally {
                timing.endTiming();
            }
        });
    }
    getDummyById(context, dummyId) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(context, 'dummy.get_one_by_id');
            try {
                return yield this.call('get', '/dummies/' + dummyId, context, {});
            }
            catch (ex) {
                timing.endFailure(ex);
            }
            finally {
                timing.endTiming();
            }
        });
    }
    createDummy(context, dummy) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(context, 'dummy.create');
            try {
                return yield this.call('post', '/dummies', context, {}, dummy);
            }
            catch (ex) {
                timing.endFailure(ex);
            }
            finally {
                timing.endTiming();
            }
        });
    }
    updateDummy(context, dummy) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(context, 'dummy.update');
            try {
                return yield this.call('put', '/dummies', context, {}, dummy);
            }
            catch (ex) {
                timing.endFailure(ex);
            }
            finally {
                timing.endTiming();
            }
        });
    }
    deleteDummy(context, dummyId) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(context, 'dummy.delete_by_id');
            try {
                return yield this.call('delete', '/dummies/' + dummyId, context, {});
            }
            catch (ex) {
                timing.endFailure(ex);
            }
            finally {
                timing.endTiming();
            }
        });
    }
    checkTraceId(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(context, 'dummy.check_trace_id');
            try {
                let result = yield this.call('get', '/dummies/check/trace_id', context, {});
                return result != null ? result.trace_id : null;
            }
            catch (ex) {
                timing.endFailure(ex);
            }
            finally {
                timing.endTiming();
            }
        });
    }
}
exports.DummyRestClient = DummyRestClient;
//# sourceMappingURL=DummyRestClient.js.map