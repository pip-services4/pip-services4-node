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
exports.DummyDirectClient = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const DirectClient_1 = require("../../src/clients/DirectClient");
class DummyDirectClient extends DirectClient_1.DirectClient {
    constructor() {
        super();
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor("pip-services-dummies", "service", "*", "*", "*"));
    }
    getDummies(context, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            let timing = this.instrument(context, 'dummy.get_page_by_filter');
            try {
                return yield this._service.getPageByFilter(context, filter, paging);
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
                return yield this._service.getOneById(context, dummyId);
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
                return yield this._service.create(context, dummy);
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
                return yield this._service.update(context, dummy);
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
                return yield this._service.deleteById(context, dummyId);
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
                return yield this._service.checkTraceId(context);
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
exports.DummyDirectClient = DummyDirectClient;
//# sourceMappingURL=DummyDirectClient.js.map