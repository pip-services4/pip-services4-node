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
exports.DummyCommandSet = void 0;
const pip_services4_rpc_node_1 = require("pip-services4-rpc-node");
const pip_services4_rpc_node_2 = require("pip-services4-rpc-node");
const pip_services4_data_node_1 = require("pip-services4-data-node");
const pip_services4_data_node_2 = require("pip-services4-data-node");
const pip_services4_data_node_3 = require("pip-services4-data-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_data_node_4 = require("pip-services4-data-node");
const pip_services4_data_node_5 = require("pip-services4-data-node");
const DummySchema_1 = require("./DummySchema");
class DummyCommandSet extends pip_services4_rpc_node_1.CommandSet {
    constructor(controller) {
        super();
        this._controller = controller;
        this.addCommand(this.makeGetPageByFilterCommand());
        this.addCommand(this.makeGetOneByIdCommand());
        this.addCommand(this.makeCreateCommand());
        this.addCommand(this.makeUpdateCommand());
        this.addCommand(this.makeDeleteByIdCommand());
        this.addCommand(this.makeCheckTraceIdCommand());
    }
    makeGetPageByFilterCommand() {
        return new pip_services4_rpc_node_2.Command("get_dummies", new pip_services4_data_node_3.ObjectSchema(true)
            .withOptionalProperty("filter", new pip_services4_data_node_4.FilterParamsSchema())
            .withOptionalProperty("paging", new pip_services4_data_node_5.PagingParamsSchema()), (context, args) => __awaiter(this, void 0, void 0, function* () {
            let filter = pip_services4_data_node_1.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services4_data_node_2.PagingParams.fromValue(args.get("paging"));
            return yield this._controller.getPageByFilter(context, filter, paging);
        }));
    }
    makeGetOneByIdCommand() {
        return new pip_services4_rpc_node_2.Command("get_dummy_by_id", new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String), (context, args) => __awaiter(this, void 0, void 0, function* () {
            let id = args.getAsString("dummy_id");
            return yield this._controller.getOneById(context, id);
        }));
    }
    makeCreateCommand() {
        return new pip_services4_rpc_node_2.Command("create_dummy", new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema()), (context, args) => __awaiter(this, void 0, void 0, function* () {
            let entity = args.get("dummy");
            return yield this._controller.create(context, entity);
        }));
    }
    makeUpdateCommand() {
        return new pip_services4_rpc_node_2.Command("update_dummy", new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema()), (context, args) => __awaiter(this, void 0, void 0, function* () {
            let entity = args.get("dummy");
            return yield this._controller.update(context, entity);
        }));
    }
    makeDeleteByIdCommand() {
        return new pip_services4_rpc_node_2.Command("delete_dummy", new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String), (context, args) => __awaiter(this, void 0, void 0, function* () {
            let id = args.getAsString("dummy_id");
            return yield this._controller.deleteById(context, id);
        }));
    }
    makeCheckTraceIdCommand() {
        return new pip_services4_rpc_node_2.Command("check_trace_id", new pip_services4_data_node_3.ObjectSchema(true), (context, args) => __awaiter(this, void 0, void 0, function* () {
            let value = yield this._controller.checkTraceId(context);
            return { trace_id: value };
        }));
    }
}
exports.DummyCommandSet = DummyCommandSet;
//# sourceMappingURL=DummyCommandSet.js.map