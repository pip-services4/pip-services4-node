"use strict";
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
    constructor(service) {
        super();
        this._service = service;
        this.addCommand(this.makeGetPageByFilterCommand());
        this.addCommand(this.makeGetOneByIdCommand());
        this.addCommand(this.makeCreateCommand());
        this.addCommand(this.makeUpdateCommand());
        this.addCommand(this.makeDeleteByIdCommand());
    }
    makeGetPageByFilterCommand() {
        return new pip_services4_rpc_node_2.Command("get_dummies", new pip_services4_data_node_3.ObjectSchema(true)
            .withOptionalProperty("filter", new pip_services4_data_node_4.FilterParamsSchema())
            .withOptionalProperty("paging", new pip_services4_data_node_5.PagingParamsSchema()), (context, args) => {
            let filter = pip_services4_data_node_1.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services4_data_node_2.PagingParams.fromValue(args.get("paging"));
            return this._service.getPageByFilter(context, filter, paging);
        });
    }
    makeGetOneByIdCommand() {
        return new pip_services4_rpc_node_2.Command("get_dummy_by_id", new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String), (context, args) => {
            let id = args.getAsString("dummy_id");
            return this._service.getOneById(context, id);
        });
    }
    makeCreateCommand() {
        return new pip_services4_rpc_node_2.Command("create_dummy", new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema()), (context, args) => {
            let entity = args.get("dummy");
            return this._service.create(context, entity);
        });
    }
    makeUpdateCommand() {
        return new pip_services4_rpc_node_2.Command("update_dummy", new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy", new DummySchema_1.DummySchema()), (context, args) => {
            let entity = args.get("dummy");
            return this._service.update(context, entity);
        });
    }
    makeDeleteByIdCommand() {
        return new pip_services4_rpc_node_2.Command("delete_dummy", new pip_services4_data_node_3.ObjectSchema(true)
            .withRequiredProperty("dummy_id", pip_services4_commons_node_1.TypeCode.String), (context, args) => {
            let id = args.getAsString("dummy_id");
            return this._service.deleteById(context, id);
        });
    }
}
exports.DummyCommandSet = DummyCommandSet;
//# sourceMappingURL=DummyCommandSet.js.map