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
const pip_services4_data_node_1 = require("pip-services4-data-node");
const pip_services4_data_node_2 = require("pip-services4-data-node");
const pip_services4_data_node_3 = require("pip-services4-data-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_http_node_1 = require("pip-services4-http-node");
const DummySchema_1 = require("../data/DummySchema");
class DummyRestController extends pip_services4_http_node_1.RestController {
    constructor() {
        super();
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor("pip-services-dummies", "service", "default", "*", "*"));
    }
    configure(config) {
        super.configure(config);
    }
    setReferences(references) {
        super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired('service');
    }
    getPageByFilter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._service.getPageByFilter(req.params.trace_id, new pip_services4_data_node_1.FilterParams(req.params), new pip_services4_data_node_2.PagingParams(req.params));
                this.sendResult(req, res, result);
            }
            catch (ex) {
                this.sendError(req, res, ex);
            }
        });
    }
    getOneById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._service.getOneById(req.params.trace_id, req.params.dummy_id);
                this.sendResult(req, res, result);
            }
            catch (ex) {
                this.sendError(req, res, ex);
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._service.create(req.params.trace_id, req.body);
                this.sendCreatedResult(req, res, result);
            }
            catch (ex) {
                this.sendError(req, res, ex);
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._service.update(req.params.trace_id, req.body);
                this.sendResult(req, res, result);
            }
            catch (ex) {
                this.sendError(req, res, ex);
            }
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._service.deleteById(req.params.trace_id, req.params.dummy_id);
                this.sendDeletedResult(req, res, result);
            }
            catch (ex) {
                this.sendError(req, res, ex);
            }
        });
    }
    register() {
        this.registerRoute('get', '/dummies', new pip_services4_data_node_3.ObjectSchema(true)
            .withOptionalProperty("skip", pip_services4_commons_node_1.TypeCode.String)
            .withOptionalProperty("take", pip_services4_commons_node_1.TypeCode.String)
            .withOptionalProperty("total", pip_services4_commons_node_1.TypeCode.String), this.getPageByFilter);
        this.registerRoute('get', '/dummies/:dummy_id', new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String), this.getOneById);
        this.registerRoute('post', '/dummies', new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("body", new DummySchema_1.DummySchema()), this.create);
        this.registerRoute('put', '/dummies/:dummy_id', new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("body", new DummySchema_1.DummySchema()), this.update);
        this.registerRoute('delete', '/dummies/:dummy_id', new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String), this.deleteById);
        this._swaggerRoute = '/dummies/swagger';
        this.registerOpenApiSpecFromFile(__dirname + '/../../../example/controllers/dummy.yml');
    }
}
exports.DummyRestController = DummyRestController;
//# sourceMappingURL=DummyRestController.js.map