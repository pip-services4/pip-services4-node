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
exports.DummyCloudFunction = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
const pip_services4_data_node_2 = require("pip-services4-data-node");
const pip_services4_data_node_3 = require("pip-services4-data-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_data_node_4 = require("pip-services4-data-node");
const pip_services4_data_node_5 = require("pip-services4-data-node");
const pip_services4_http_node_1 = require("pip-services4-http-node");
const CloudFunction_1 = require("../../src/containers/CloudFunction");
const DummyFactory_1 = require("../sample/DummyFactory");
const DummySchema_1 = require("../sample/DummySchema");
class DummyCloudFunction extends CloudFunction_1.CloudFunction {
    constructor() {
        super("dummy", "Dummy GCP function");
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
    setReferences(references) {
        super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired('service');
    }
    getPageByFilter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = req.body;
            let page = this._service.getPageByFilter(params.trace_id, new pip_services4_data_node_1.FilterParams(params.filter), new pip_services4_data_node_2.PagingParams(params.paging));
            pip_services4_http_node_1.HttpResponseSender.sendResult(req, res, page);
        });
    }
    getOneById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = req.body;
            let dummy = yield this._service.getOneById(params.trace_id, params.dummy_id);
            if (dummy != null) {
                pip_services4_http_node_1.HttpResponseSender.sendResult(req, res, dummy);
            }
            else {
                pip_services4_http_node_1.HttpResponseSender.sendEmptyResult(req, res);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = req.body;
            let dummy = yield this._service.create(params.trace_id, params.dummy);
            pip_services4_http_node_1.HttpResponseSender.sendCreatedResult(req, res, dummy);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = req.body;
            let dummy = yield this._service.update(params.trace_id, params.dummy);
            pip_services4_http_node_1.HttpResponseSender.sendResult(req, res, dummy);
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = req.body;
            let dummy = yield this._service.deleteById(params.trace_id, params.dummy_id);
            pip_services4_http_node_1.HttpResponseSender.sendDeletedResult(req, res, dummy);
        });
    }
    register() {
        this.registerAction('get_dummies', new pip_services4_data_node_3.ObjectSchema(true)
            .withOptionalProperty('body', new pip_services4_data_node_3.ObjectSchema(true)
            .withOptionalProperty("filter", new pip_services4_data_node_4.FilterParamsSchema())
            .withOptionalProperty("paging", new pip_services4_data_node_5.PagingParamsSchema())), this.getPageByFilter);
        this.registerAction('get_dummy_by_id', new pip_services4_data_node_3.ObjectSchema(true)
            .withOptionalProperty("body", new pip_services4_data_node_3.ObjectSchema(true)
            .withOptionalProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String)), this.getOneById);
        this.registerAction('create_dummy', new pip_services4_data_node_3.ObjectSchema(true)
            .withOptionalProperty("body", new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema())), this.create);
        this.registerAction('update_dummy', new pip_services4_data_node_3.ObjectSchema(true)
            .withOptionalProperty("body", new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema())), this.update);
        this.registerAction('delete_dummy', new pip_services4_data_node_3.ObjectSchema(true)
            .withOptionalProperty("body", new pip_services4_data_node_3.ObjectSchema(true)
            .withOptionalProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String)), this.deleteById);
    }
}
exports.DummyCloudFunction = DummyCloudFunction;
//# sourceMappingURL=DummyCloudFunction.js.map