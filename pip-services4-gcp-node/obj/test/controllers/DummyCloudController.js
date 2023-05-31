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
exports.DummyCloudController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_data_node_2 = require("pip-services4-data-node");
const pip_services4_data_node_3 = require("pip-services4-data-node");
const pip_services4_http_node_1 = require("pip-services4-http-node");
const CloudFunctionController_1 = require("../../src/controllers/CloudFunctionController");
const DummySchema_1 = require("../sample/DummySchema");
class DummyCloudController extends CloudFunctionController_1.CloudFunctionController {
    constructor() {
        super("dummies");
        this._headers = {
            'Content-Type': 'application/json'
        };
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }
    setReferences(references) {
        super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired('service');
    }
    getPageByFilter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = req.body;
            const page = yield this._service.getPageByFilter(params.trace_id, new pip_services4_data_node_1.FilterParams(params.filter), new pip_services4_data_node_1.PagingParams(params.paging));
            res.set(this._headers);
            pip_services4_http_node_1.HttpResponseSender.sendResult(req, res, page);
        });
    }
    getOneById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = req.body;
            const dummy = yield this._service.getOneById(params.trace_id, params.dummy_id);
            res.set(this._headers);
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
            const dummy = yield this._service.create(params.trace_id, params.dummy);
            res.set(this._headers);
            pip_services4_http_node_1.HttpResponseSender.sendCreatedResult(req, res, dummy);
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = req.body;
            const dummy = yield this._service.update(params.trace_id, params.dummy);
            res.set(this._headers);
            pip_services4_http_node_1.HttpResponseSender.sendResult(req, res, dummy);
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = req.body;
            const dummy = yield this._service.deleteById(params.trace_id, params.dummy_id);
            res.set(this._headers);
            pip_services4_http_node_1.HttpResponseSender.sendDeletedResult(req, res, dummy);
        });
    }
    register() {
        this.registerAction('get_dummies', new pip_services4_data_node_1.ObjectSchema(true)
            .withOptionalProperty('body', new pip_services4_data_node_1.ObjectSchema(true)
            .withOptionalProperty("filter", new pip_services4_data_node_2.FilterParamsSchema())
            .withOptionalProperty("paging", new pip_services4_data_node_3.PagingParamsSchema())), this.getPageByFilter);
        this.registerAction('get_dummy_by_id', new pip_services4_data_node_1.ObjectSchema(true)
            .withOptionalProperty("body", new pip_services4_data_node_1.ObjectSchema(true)
            .withOptionalProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String)), this.getOneById);
        this.registerAction('create_dummy', new pip_services4_data_node_1.ObjectSchema(true)
            .withOptionalProperty("body", new pip_services4_data_node_1.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema())), this.create);
        this.registerAction('update_dummy', new pip_services4_data_node_1.ObjectSchema(true)
            .withOptionalProperty("body", new pip_services4_data_node_1.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema())), this.update);
        this.registerAction('delete_dummy', new pip_services4_data_node_1.ObjectSchema(true)
            .withOptionalProperty("body", new pip_services4_data_node_1.ObjectSchema(true)
            .withOptionalProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String)), this.deleteById);
    }
}
exports.DummyCloudController = DummyCloudController;
//# sourceMappingURL=DummyCloudController.js.map