"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableGrpcClient = void 0;
const CommandableGrpcClient_1 = require("../../src/clients/CommandableGrpcClient");
class DummyCommandableGrpcClient extends CommandableGrpcClient_1.CommandableGrpcClient {
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
}
exports.DummyCommandableGrpcClient = DummyCommandableGrpcClient;
//# sourceMappingURL=DummyCommandableGrpcClient.js.map