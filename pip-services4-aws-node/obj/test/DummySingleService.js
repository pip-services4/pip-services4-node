"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummySingleService = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
class DummySingleService {
    constructor() {
        this._dependencyResolver = new pip_services4_components_node_1.DependencyResolver(DummySingleService._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._persistence = references.getOneRequired(new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'persistence', '*', '*', '1.0'));
    }
    getPageByFilter(context, filter, paging) {
        return this._persistence.getPageByFilter(context, filter, paging);
    }
    getOneById(context, dummyId) {
        return this._persistence.getOneById(context, dummyId);
    }
    create(context, dummy) {
        dummy.id = dummy.id || pip_services4_data_node_1.IdGenerator.nextLong();
        return this._persistence.create(context, dummy);
    }
    update(context, dummy) {
        return this._persistence.update(context, dummy);
    }
    deleteById(context, dummyId) {
        return this._persistence.deleteById(context, dummyId);
    }
}
exports.DummySingleService = DummySingleService;
DummySingleService._defaultConfig = pip_services4_components_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-dummies:persistence:*:*:1.0');
//# sourceMappingURL=DummySingleService.js.map