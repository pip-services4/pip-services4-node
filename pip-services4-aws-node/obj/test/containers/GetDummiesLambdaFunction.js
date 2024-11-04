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
exports.getDummiesHandler = exports.GetDummiesLambdaFunction = void 0;
const LambdaSingleFunction_1 = require("../../src/containers/LambdaSingleFunction");
const DummyFactory_1 = require("../DummyFactory");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
class GetDummiesLambdaFunction extends LambdaSingleFunction_1.LambdaSingleFunction {
    constructor() {
        super("get_dummies", "Get Dummies lambda single function");
        this._dependencyResolver.put('single-service', new pip_services4_components_node_1.Descriptor('pip-services-dummies', 'service', 'single-service', '*', '*'));
        this._factories.add(new DummyFactory_1.DummyFactory());
    }
    setReferences(references) {
        super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired('single-service');
    }
    getPageByFilter(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._service.getPageByFilter(params.trace_id, new pip_services4_data_node_1.FilterParams(params.filter), new pip_services4_data_node_1.PagingParams(params.paging));
        });
    }
    register() {
        this.registerSingleAction(new pip_services4_data_node_1.ObjectSchema(true)
            .withOptionalProperty("filter", new pip_services4_data_node_1.FilterParamsSchema())
            .withOptionalProperty("paging", new pip_services4_data_node_1.PagingParamsSchema()), this.getPageByFilter);
    }
}
exports.GetDummiesLambdaFunction = GetDummiesLambdaFunction;
exports.getDummiesHandler = new GetDummiesLambdaFunction().getHandler();
//# sourceMappingURL=GetDummiesLambdaFunction.js.map