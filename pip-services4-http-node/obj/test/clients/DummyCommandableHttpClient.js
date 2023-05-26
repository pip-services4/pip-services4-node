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
exports.DummyCommandableHttpClient = void 0;
const CommandableHttpClient_1 = require("../../src/clients/CommandableHttpClient");
class DummyCommandableHttpClient extends CommandableHttpClient_1.CommandableHttpClient {
    constructor() {
        super('dummy');
    }
    getDummies(context, filter, paging) {
        return this.callCommand('get_dummies', context, {
            filter: filter,
            paging: paging
        });
    }
    getDummyById(context, dummyId) {
        return this.callCommand('get_dummy_by_id', context, {
            dummy_id: dummyId
        });
    }
    createDummy(context, dummy) {
        return this.callCommand('create_dummy', context, {
            dummy: dummy
        });
    }
    updateDummy(context, dummy) {
        return this.callCommand('update_dummy', context, {
            dummy: dummy
        });
    }
    deleteDummy(context, dummyId) {
        return this.callCommand('delete_dummy', context, {
            dummy_id: dummyId
        });
    }
    checkTraceId(context) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this.callCommand('check_trace_id', context, null);
            return result != null ? result.trace_id : null;
        });
    }
}
exports.DummyCommandableHttpClient = DummyCommandableHttpClient;
//# sourceMappingURL=DummyCommandableHttpClient.js.map