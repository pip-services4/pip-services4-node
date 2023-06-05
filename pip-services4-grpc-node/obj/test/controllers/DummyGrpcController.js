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
exports.DummyGrpcController = void 0;
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
const pip_services4_data_node_2 = require("pip-services4-data-node");
const pip_services4_data_node_3 = require("pip-services4-data-node");
const pip_services4_data_node_4 = require("pip-services4-data-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_data_node_5 = require("pip-services4-data-node");
const DummySchema_1 = require("../sample/DummySchema");
const GrpcController_1 = require("../../src/controllers/GrpcController");
class DummyGrpcController extends GrpcController_1.GrpcController {
    constructor() {
        super(__dirname + "../../../../test/protos/dummies.proto", "dummies.Dummies.service");
        this._numberOfCalls = 0;
        this._dependencyResolver.put('service', new pip_services4_components_node_1.Descriptor("pip-services-dummies", "service", "default", "*", "*"));
    }
    setReferences(references) {
        super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired('service');
    }
    getNumberOfCalls() {
        return this._numberOfCalls;
    }
    incrementNumberOfCalls(call, next) {
        this._numberOfCalls++;
        return next(call);
    }
    getPageByFilter(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let filter = pip_services4_data_node_1.FilterParams.fromValue(call.request.filter);
            let paging = pip_services4_data_node_2.PagingParams.fromValue(call.request.paging);
            return yield this._service.getPageByFilter(call.request.trace_id, filter, paging);
        });
    }
    getOneById(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this._service.getOneById(call.request.trace_id, call.request.dummy_id);
            return result || {};
        });
    }
    create(call) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._service.create(call.request.trace_id, call.request.dummy);
        });
    }
    update(call) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._service.update(call.request.trace_id, call.request.dummy);
        });
    }
    deleteById(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield this._service.deleteById(call.request.trace_id, call.request.dummy_id);
            return result || {};
        });
    }
    register() {
        this.registerInterceptor(this.incrementNumberOfCalls);
        this.registerMethod('get_dummies', new pip_services4_data_node_4.ObjectSchema(true)
            .withOptionalProperty("paging", new pip_services4_data_node_3.PagingParamsSchema())
            .withOptionalProperty("filter", new pip_services4_data_node_5.FilterParamsSchema()), this.getPageByFilter);
        this.registerMethod('get_dummy_by_id', new pip_services4_data_node_4.ObjectSchema(true)
            .withRequiredProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String), this.getOneById);
        this.registerMethod('create_dummy', new pip_services4_data_node_4.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema()), this.create);
        this.registerMethod('update_dummy', new pip_services4_data_node_4.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema()), this.update);
        this.registerMethod('delete_dummy_by_id', new pip_services4_data_node_4.ObjectSchema(true)
            .withRequiredProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String), this.deleteById);
    }
}
exports.DummyGrpcController = DummyGrpcController;
//# sourceMappingURL=DummyGrpcController.js.map