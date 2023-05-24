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
exports.DummyCommandableCloudFunctionClient = void 0;
const CommandableCloudFunctionClient_1 = require("../../src/clients/CommandableCloudFunctionClient");
class DummyCommandableCloudFunctionClient extends CommandableCloudFunctionClient_1.CommandableCloudFunctionClient {
    constructor() {
        super("dummies");
    }
    getDummies(correlationId, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callCommand('dummies.get_dummies', correlationId, {
                filter: filter,
                paging: paging
            });
        });
    }
    getDummyById(correlationId, dummyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callCommand('dummies.get_dummy_by_id', correlationId, {
                dummy_id: dummyId
            });
            if (response == null || Object.keys(response).length === 0) {
                return null;
            }
            return response;
        });
    }
    createDummy(correlationId, dummy) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callCommand('dummies.create_dummy', correlationId, {
                dummy: dummy
            });
        });
    }
    updateDummy(correlationId, dummy) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callCommand('dummies.update_dummy', correlationId, {
                dummy: dummy
            });
        });
    }
    deleteDummy(correlationId, dummyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callCommand('dummies.delete_dummy', correlationId, {
                dummy_id: dummyId
            });
        });
    }
}
exports.DummyCommandableCloudFunctionClient = DummyCommandableCloudFunctionClient;
//# sourceMappingURL=DummyCommandableCloudFunctionClient.js.map