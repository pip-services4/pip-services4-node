"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyProcess = void 0;
const ProcessContainer_1 = require("../src/ProcessContainer");
const DummyFactory_1 = require("./DummyFactory");
class DummyProcess extends ProcessContainer_1.ProcessContainer {
    constructor() {
        super("dummy", "Sample dummy process");
        this._configPath = './config/dummy.yaml';
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
}
exports.DummyProcess = DummyProcess;
//# sourceMappingURL=DummyProcess.js.map