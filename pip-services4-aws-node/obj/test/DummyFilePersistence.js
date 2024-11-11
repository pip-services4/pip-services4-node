"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyFilePersistence = void 0;
const DummyMemoryPersistence_1 = require("./DummyMemoryPersistence");
const pip_services4_persistence_node_1 = require("pip-services4-persistence-node");
class DummyFilePersistence extends DummyMemoryPersistence_1.DummyMemoryPersistence {
    constructor(path) {
        super();
        this._persister = new pip_services4_persistence_node_1.JsonFilePersister(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }
    configure(config) {
        super.configure(config);
        this._persister.configure(config);
    }
}
exports.DummyFilePersistence = DummyFilePersistence;
//# sourceMappingURL=DummyFilePersistence.js.map