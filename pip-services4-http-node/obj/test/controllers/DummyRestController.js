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
exports.DummyRestController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_components_node_2 = require("pip-services4-components-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
const pip_services4_data_node_2 = require("pip-services4-data-node");
const pip_services4_data_node_3 = require("pip-services4-data-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_data_node_4 = require("pip-services4-data-node");
const DummySchema_1 = require("../sample/DummySchema");
const RestController_1 = require("../../src/controllers/RestController");
class DummyRestController extends RestController_1.RestController {
    constructor() {
        super();
        this._numberOfCalls = 0;
        this._dependencyResolver.put('service', new pip_services4_components_node_2.Descriptor("pip-services-dummies", "service", "default", "*", "*"));
    }
    configure(config) {
        super.configure(config);
        this._swaggerContent = config.getAsNullableString("swagger.content");
        this._swaggerPath = config.getAsNullableString("swagger.path");
    }
    setReferences(references) {
        super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired('service');
    }
    getNumberOfCalls() {
        return this._numberOfCalls;
    }
    incrementNumberOfCalls(req, res, next) {
        this._numberOfCalls++;
        next();
    }
    getPageByFilter(req, res) {
        let promise = this._service.getPageByFilter(pip_services4_components_node_1.Context.fromTraceId(this.getTraceId(req)), new pip_services4_data_node_1.FilterParams(req.params), new pip_services4_data_node_2.PagingParams(req.params));
        this.sendResult(req, res, promise);
    }
    getOneById(req, res) {
        let promise = this._service.getOneById(pip_services4_components_node_1.Context.fromTraceId(this.getTraceId(req)), req.params.dummy_id);
        this.sendResult(req, res, promise);
    }
    create(req, res) {
        let promise = this._service.create(pip_services4_components_node_1.Context.fromTraceId(this.getTraceId(req)), req.body);
        this.sendCreatedResult(req, res, promise);
    }
    update(req, res) {
        let promise = this._service.update(pip_services4_components_node_1.Context.fromTraceId(this.getTraceId(req)), req.body);
        this.sendResult(req, res, promise);
    }
    deleteById(req, res) {
        let promise = this._service.deleteById(pip_services4_components_node_1.Context.fromTraceId(this.getTraceId(req)), req.params.dummy_id);
        this.sendDeletedResult(req, res, promise);
    }
    checkTraceId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this._service.checkTraceId(pip_services4_components_node_1.Context.fromTraceId(this.getTraceId(req)));
                this.sendResult(req, res, { trace_id: result });
            }
            catch (ex) {
                this.sendError(req, res, ex);
            }
        });
    }
    register() {
        this.registerInterceptor('/dummies$', this.incrementNumberOfCalls);
        this.registerRoute('get', '/dummies', new pip_services4_data_node_3.ObjectSchema(true)
            .withOptionalProperty("skip", pip_services4_commons_node_1.TypeCode.String)
            .withOptionalProperty("take", pip_services4_commons_node_1.TypeCode.String)
            .withOptionalProperty("total", pip_services4_commons_node_1.TypeCode.String)
            .withOptionalProperty("body", new pip_services4_data_node_4.FilterParamsSchema()), this.getPageByFilter);
        this.registerRoute("get", "/dummies/check/trace_id", new pip_services4_data_node_3.ObjectSchema(true), this.checkTraceId);
        this.registerRoute('get', '/dummies/:dummy_id', new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String), this.getOneById);
        this.registerRoute('post', '/dummies', new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("body", new DummySchema_1.DummySchema()), this.create);
        this.registerRoute('put', '/dummies', new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("body", new DummySchema_1.DummySchema()), this.update);
        this.registerRoute('delete', '/dummies/:dummy_id', new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String), this.deleteById);
        if (this._swaggerContent) {
            this.registerOpenApiSpec(this._swaggerContent);
        }
        if (this._swaggerPath) {
            this.registerOpenApiSpecFromFile(this._swaggerPath);
        }
    }
}
exports.DummyRestController = DummyRestController;
//# sourceMappingURL=DummyRestController.js.map