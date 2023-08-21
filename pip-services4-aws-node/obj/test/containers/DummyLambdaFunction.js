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
exports.handler = exports.DummyLambdaFunction = void 0;
const LambdaFunction_1 = require("../../src/containers/LambdaFunction");
const DummyFactory_1 = require("../DummyFactory");
const DummySchema_1 = require("../DummySchema");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
class DummyLambdaFunction extends LambdaFunction_1.LambdaFunction {
    constructor() {
        super("dummy", "Dummy lambda function");
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
    setReferences(references) {
        super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired('service');
    }
    getPageByFilter(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._service.getPageByFilter(params.trace_id, new pip_services4_data_node_1.FilterParams(params.filter), new pip_services4_data_node_1.PagingParams(params.paging));
        });
    }
    getOneById(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._service.getOneById(params.trace_id, params.dummy_id);
        });
    }
    create(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._service.create(params.trace_id, params.dummy);
        });
    }
    update(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._service.update(params.trace_id, params.dummy);
        });
    }
    deleteById(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._service.deleteById(params.trace_id, params.dummy_id);
        });
    }
    register() {
        this.registerAction('get_dummies', new pip_services4_data_node_1.ObjectSchema(true)
            .withOptionalProperty("filter", new pip_services4_data_node_1.FilterParamsSchema())
            .withOptionalProperty("paging", new pip_services4_data_node_1.PagingParamsSchema()), this.getPageByFilter);
        this.registerAction('get_dummy_by_id', new pip_services4_data_node_1.ObjectSchema(true)
            .withOptionalProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String), this.getOneById);
        this.registerAction('create_dummy', new pip_services4_data_node_1.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema()), this.create);
        this.registerAction('update_dummy', new pip_services4_data_node_1.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema()), this.update);
        this.registerAction('delete_dummy', new pip_services4_data_node_1.ObjectSchema(true)
            .withOptionalProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String), this.deleteById);
    }
}
exports.DummyLambdaFunction = DummyLambdaFunction;
exports.handler = new DummyLambdaFunction().getHandler();
//# sourceMappingURL=DummyLambdaFunction.js.map