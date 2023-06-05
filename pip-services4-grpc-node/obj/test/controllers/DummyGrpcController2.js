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
exports.DummyGrpcController2 = void 0;
const services = require('../../../test/protos/dummies_grpc_pb');
const messages = require('../../../test/protos/dummies_pb');
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
const pip_services4_data_node_2 = require("pip-services4-data-node");
const GrpcController_1 = require("../../src/controllers/GrpcController");
class DummyGrpcController2 extends GrpcController_1.GrpcController {
    constructor() {
        super(services.DummiesService);
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
    dummyToObject(dummy) {
        let obj = new messages.Dummy();
        if (dummy) {
            obj.setId(dummy.id);
            obj.setKey(dummy.key);
            obj.setContent(dummy.content);
        }
        return obj;
    }
    dummyPageToObject(page) {
        let obj = new messages.DummiesPage();
        if (page) {
            obj.setTotal(page.total);
            let data = page.data.map(this.dummyToObject);
            obj.setDataList(data);
        }
        return obj;
    }
    getPageByFilter(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = call.request.toObject();
            let filter = pip_services4_data_node_1.FilterParams.fromValue(request.filterMap);
            let paging = pip_services4_data_node_2.PagingParams.fromValue(call.request.paging);
            let page = yield this._service.getPageByFilter(call.request.trace_id, filter, paging);
            return this.dummyPageToObject(page);
        });
    }
    getOneById(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = call.request.toObject();
            let result = yield this._service.getOneById(request.trace_id, request.dummy_id);
            return this.dummyToObject(result);
        });
    }
    create(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = call.request.toObject();
            let result = yield this._service.create(request.trace_id, request.dummy);
            return this.dummyToObject(result);
        });
    }
    update(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = call.request.toObject();
            let result = yield this._service.update(request.trace_id, request.dummy);
            return this.dummyToObject(result);
        });
    }
    deleteById(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let request = call.request.toObject();
            let result = yield this._service.deleteById(request.trace_id, request.dummy_id);
            return this.dummyToObject(result);
        });
    }
    register() {
        this.registerInterceptor(this.incrementNumberOfCalls);
        this.registerMethod('get_dummies', null, 
        // new ObjectSchema(true)
        //     .withOptionalProperty("paging", new PagingParamsSchema())
        //     .withOptionalProperty("filter", new FilterParamsSchema()),
        this.getPageByFilter);
        this.registerMethod('get_dummy_by_id', null, 
        // new ObjectSchema(true)
        //     .withRequiredProperty("dummy_id", TypeCode.String),
        this.getOneById);
        this.registerMethod('create_dummy', null, 
        // new ObjectSchema(true)
        //     .withRequiredProperty("dummy", new DummySchema()),
        this.create);
        this.registerMethod('update_dummy', null, 
        // new ObjectSchema(true)
        //     .withRequiredProperty("dummy", new DummySchema()),
        this.update);
        this.registerMethod('delete_dummy_by_id', null, 
        // new ObjectSchema(true)
        //     .withRequiredProperty("dummy_id", TypeCode.String),
        this.deleteById);
    }
}
exports.DummyGrpcController2 = DummyGrpcController2;
//# sourceMappingURL=DummyGrpcController2.js.map