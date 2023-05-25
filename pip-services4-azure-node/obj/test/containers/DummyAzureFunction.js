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
exports.DummyAzureFunction = void 0;
const pip_services3_commons_node_1 = require("pip-services4-commons-node");
const pip_services3_commons_node_2 = require("pip-services4-commons-node");
const pip_services3_commons_node_3 = require("pip-services4-commons-node");
const pip_services3_commons_node_4 = require("pip-services4-commons-node");
const pip_services3_commons_node_5 = require("pip-services4-commons-node");
const pip_services3_commons_node_6 = require("pip-services4-commons-node");
const pip_services3_commons_node_7 = require("pip-services4-commons-node");
const AzureFunction_1 = require("../../src/containers/AzureFunction");
const DummyFactory_1 = require("../DummyFactory");
const DummySchema_1 = require("../DummySchema");
class DummyAzureFunction extends AzureFunction_1.AzureFunction {
    constructor() {
        super("dummy", "Dummy Azure function");
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
    setReferences(references) {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired('controller');
    }
    getPageByFilter(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._controller.getPageByFilter(req.body.trace_id, new pip_services3_commons_node_2.FilterParams(req.body.filter), new pip_services3_commons_node_3.PagingParams(req.body.paging));
        });
    }
    getOneById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._controller.getOneById(req.body.trace_id, req.body.dummy_id);
        });
    }
    create(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._controller.create(req.body.trace_id, req.body.dummy);
        });
    }
    update(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._controller.update(req.body.trace_id, req.body.dummy);
        });
    }
    deleteById(req) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._controller.deleteById(req.body.trace_id, req.body.dummy_id);
        });
    }
    register() {
        this.registerAction('get_dummies', new pip_services3_commons_node_4.ObjectSchema(true).withOptionalProperty('body', new pip_services3_commons_node_4.ObjectSchema()
            .withOptionalProperty("filter", new pip_services3_commons_node_6.FilterParamsSchema())
            .withOptionalProperty("paging", new pip_services3_commons_node_7.PagingParamsSchema())), this.getPageByFilter);
        this.registerAction('get_dummy_by_id', new pip_services3_commons_node_4.ObjectSchema(true).withOptionalProperty('body', new pip_services3_commons_node_4.ObjectSchema(true)
            .withOptionalProperty("dummy_id", pip_services3_commons_node_5.TypeCode.String)), this.getOneById);
        this.registerAction('create_dummy', new pip_services3_commons_node_4.ObjectSchema(true).withOptionalProperty('body', new pip_services3_commons_node_4.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema())), this.create);
        this.registerAction('update_dummy', new pip_services3_commons_node_4.ObjectSchema(true).withOptionalProperty('body', new pip_services3_commons_node_4.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema())), this.update);
        this.registerAction('delete_dummy', new pip_services3_commons_node_4.ObjectSchema(true).withOptionalProperty('body', new pip_services3_commons_node_4.ObjectSchema(true)
            .withOptionalProperty("dummy_id", pip_services3_commons_node_5.TypeCode.String)), this.deleteById);
    }
}
exports.DummyAzureFunction = DummyAzureFunction;
//# sourceMappingURL=DummyAzureFunction.js.map