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
exports.DummyLambdaClient = void 0;
const LambdaClient_1 = require("../../src/clients/LambdaClient");
class DummyLambdaClient extends LambdaClient_1.LambdaClient {
    constructor() {
        super();
    }
    getDummies(context, filter, paging) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call('get_dummies', context, {
                filter: filter,
                paging: paging
            });
        });
    }
    getDummyById(context, dummyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call('get_dummy_by_id', context, {
                dummy_id: dummyId
            });
        });
    }
    createDummy(context, dummy) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call('create_dummy', context, {
                dummy: dummy
            });
        });
    }
    updateDummy(context, dummy) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call('update_dummy', context, {
                dummy: dummy
            });
        });
    }
    deleteDummy(context, dummyId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.call('delete_dummy', context, {
                dummy_id: dummyId
            });
        });
    }
}
exports.DummyLambdaClient = DummyLambdaClient;
//# sourceMappingURL=DummyLambdaClient.js.map