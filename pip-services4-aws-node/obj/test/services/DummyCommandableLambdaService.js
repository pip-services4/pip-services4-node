"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyCommandableLambdaService = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const CommandableLambdaService_1 = require("../../src/services/CommandableLambdaService");
class DummyCommandableLambdaService extends CommandableLambdaService_1.CommandableLambdaService {
    constructor() {
        super("dummies");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }
}
exports.DummyCommandableLambdaService = DummyCommandableLambdaService;
//# sourceMappingURL=DummyCommandableLambdaService.js.map