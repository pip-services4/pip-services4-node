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
exports.DummyCommandableCloudClient = void 0;
const CommandableCloudFunctionClient_1 = require("../../src/clients/CommandableCloudFunctionClient");
class DummyCommandableCloudClient extends CommandableCloudFunctionClient_1.CommandableCloudFunctionClient {
    constructor() {
        super("dummies");
    }
    getDummies(context, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callCommand('get_dummies', context, {
                filter: filter,
                paging: paging
            });
        });
    }
    getDummyById(context, dummyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.callCommand('get_dummy_by_id', context, {
                dummy_id: dummyId
            });
            if (response == null || Object.keys(response).length === 0) {
                return null;
            }
            return response;
        });
    }
    createDummy(context, dummy) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callCommand('create_dummy', context, {
                dummy: dummy
            });
        });
    }
    updateDummy(context, dummy) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callCommand('update_dummy', context, {
                dummy: dummy
            });
        });
    }
    deleteDummy(context, dummyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.callCommand('delete_dummy', context, {
                dummy_id: dummyId
            });
        });
    }
}
exports.DummyCommandableCloudClient = DummyCommandableCloudClient;
//# sourceMappingURL=DummyCommandableCloudClient.js.map