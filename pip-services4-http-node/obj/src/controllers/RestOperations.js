"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestOperations = void 0;
const pip_services4_data_node_1 = require("pip-services4-data-node");
const pip_services4_data_node_2 = require("pip-services4-data-node");
const pip_services4_observability_node_1 = require("pip-services4-observability-node");
const pip_services4_observability_node_2 = require("pip-services4-observability-node");
const pip_services4_components_node_1 = require("pip-services4-components-node");
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const pip_services4_commons_node_2 = require("pip-services4-commons-node");
const pip_services4_commons_node_3 = require("pip-services4-commons-node");
const pip_services4_commons_node_4 = require("pip-services4-commons-node");
const pip_services4_commons_node_5 = require("pip-services4-commons-node");
const pip_services4_commons_node_6 = require("pip-services4-commons-node");
const HttpResponseSender_1 = require("./HttpResponseSender");
class RestOperations {
    constructor() {
        this._logger = new pip_services4_observability_node_1.CompositeLogger();
        this._counters = new pip_services4_observability_node_2.CompositeCounters();
        this._dependencyResolver = new pip_services4_components_node_1.DependencyResolver();
        //
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._dependencyResolver.setReferences(references);
    }
    getTraceId(req) {
        let context = req.query.trace_id;
        if (context == null || context == "") {
            context = req.headers['trace_id'] || req.headers['correlation_id'];
        }
        return context;
    }
    getFilterParams(req) {
        let filter;
        const value = Object.assign({}, req.query);
        if (value.filter == null) {
            delete value.skip;
            delete value.take;
            delete value.total;
            delete value.trace_id;
            filter = pip_services4_data_node_1.FilterParams.fromValue(value);
        }
        else {
            filter = pip_services4_data_node_1.FilterParams.fromString(value.filter);
        }
        return filter;
    }
    getPagingParams(req) {
        const value = {
            skip: req.query.skip,
            take: req.query.take,
            total: req.query.total
        };
        const paging = pip_services4_data_node_2.PagingParams.fromValue(value);
        return paging;
    }
    getSortParams(req) {
        var _a;
        const sort = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.sort) || "";
        const result = new pip_services4_data_node_2.SortParams();
        if (sort != null && sort.length > 0) {
            const items = sort.split(",");
            for (const item of items) {
                const parts = item.split("=");
                const param = new pip_services4_data_node_2.SortField(parts[0], pip_services4_commons_node_6.BooleanConverter.toBoolean(parts[1]));
                result.push(param);
            }
        }
        return result;
    }
    sendResult(req, res, result) {
        return HttpResponseSender_1.HttpResponseSender.sendResult(req, res, result);
    }
    sendEmptyResult(req, res) {
        return HttpResponseSender_1.HttpResponseSender.sendEmptyResult(req, res);
    }
    sendCreatedResult(req, res, result) {
        return HttpResponseSender_1.HttpResponseSender.sendCreatedResult(req, res, result);
    }
    sendDeletedResult(req, res, result) {
        return HttpResponseSender_1.HttpResponseSender.sendDeletedResult(req, res, result);
    }
    sendError(req, res, error) {
        HttpResponseSender_1.HttpResponseSender.sendError(req, res, error);
    }
    sendBadRequest(req, res, message) {
        const traceId = this.getTraceId(req);
        const error = new pip_services4_commons_node_1.BadRequestException(traceId, 'BAD_REQUEST', message);
        this.sendError(req, res, error);
    }
    sendUnauthorized(req, res, message) {
        const traceId = this.getTraceId(req);
        const error = new pip_services4_commons_node_2.UnauthorizedException(traceId, 'UNAUTHORIZED', message);
        this.sendError(req, res, error);
    }
    sendNotFound(req, res, message) {
        const traceId = this.getTraceId(req);
        const error = new pip_services4_commons_node_3.NotFoundException(traceId, 'NOT_FOUND', message);
        this.sendError(req, res, error);
    }
    sendConflict(req, res, message) {
        const traceId = this.getTraceId(req);
        const error = new pip_services4_commons_node_4.ConflictException(traceId, 'CONFLICT', message);
        this.sendError(req, res, error);
    }
    sendSessionExpired(req, res, message) {
        const traceId = this.getTraceId(req);
        const error = new pip_services4_commons_node_5.UnknownException(traceId, 'SESSION_EXPIRED', message);
        error.status = 440;
        this.sendError(req, res, error);
    }
    sendInternalError(req, res, message) {
        const traceId = this.getTraceId(req);
        const error = new pip_services4_commons_node_5.UnknownException(traceId, 'INTERNAL', message);
        this.sendError(req, res, error);
    }
    sendServerUnavailable(req, res, message) {
        const traceId = this.getTraceId(req);
        const error = new pip_services4_commons_node_4.ConflictException(traceId, 'SERVER_UNAVAILABLE', message);
        error.status = 503;
        this.sendError(req, res, error);
    }
    invoke(operation) {
        return (req, res) => {
            this[operation](req, res);
        };
    }
}
exports.RestOperations = RestOperations;
//# sourceMappingURL=RestOperations.js.map