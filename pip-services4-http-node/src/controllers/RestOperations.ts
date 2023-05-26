/** @module controllers */
import { IConfigurable } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { CompositeLogger } from 'pip-services4-observability-node';
import { CompositeCounters } from 'pip-services4-observability-node';
import { DependencyResolver } from 'pip-services4-components-node';
import { BadRequestException } from 'pip-services4-commons-node';
import { UnauthorizedException } from 'pip-services4-commons-node';
import { NotFoundException } from 'pip-services4-commons-node';
import { ConflictException } from 'pip-services4-commons-node';
import { UnknownException } from 'pip-services4-commons-node';
import { HttpResponseSender } from './HttpResponseSender';

export abstract class RestOperations implements IConfigurable, IReferenceable {
    protected _logger = new CompositeLogger();
    protected _counters = new CompositeCounters();
    protected _dependencyResolver = new DependencyResolver();

    public constructor() {}

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._logger.setReferences(references);
        this._counters.setReferences(references);
        this._dependencyResolver.setReferences(references);
    }

    protected getTraceId(req: any): any {
        let context = req.query.trace_id;
        if (context == null || context == "") {
            context = req.headers['trace_id'] || req.headers['correlation_id']
        }
        return context
    }

    protected getFilterParams(req: any): FilterParams {
        let value = Object.assign({}, req.query);
        delete value.skip;
        delete value.take;
        delete value.total;
        delete value.trace_id;

        let filter = FilterParams.fromValue(value);
        return filter;
    }

    protected getPagingParams(req: any): PagingParams {
        let value = {
            skip: req.query.skip,
            take: req.query.take,
            total: req.query.total            
        }        
        let paging = PagingParams.fromValue(value);
        return paging;
    }

    protected sendResult(req: any, res: any, result: any): void {
        return HttpResponseSender.sendResult(req, res, result);
    }

    protected sendEmptyResult(req: any, res: any): void {
        return HttpResponseSender.sendEmptyResult(req, res);
    }

    protected sendCreatedResult(req: any, res: any, result: any): void {
        return HttpResponseSender.sendCreatedResult(req, res, result);
    }

    protected sendDeletedResult(req: any, res: any, result: any): void {
        return HttpResponseSender.sendDeletedResult(req, res, result);
    }

    protected sendError(req: any, res: any, error: any): void {
        HttpResponseSender.sendError(req, res, error);
    }

    protected sendBadRequest(req: any, res: any, message: string): void {
        let traceId = this.getTraceId(req);
        let error = new BadRequestException(traceId, 'BAD_REQUEST', message);
        this.sendError(req, res, error);
    }

    protected sendUnauthorized(req: any, res: any, message: string): void  {
        let traceId = this.getTraceId(req);
        let error = new UnauthorizedException(traceId, 'UNAUTHORIZED', message);
        this.sendError(req, res, error);
    }

    protected sendNotFound(req: any, res: any, message: string): void  {
        let traceId = this.getTraceId(req);
        let error = new NotFoundException(traceId, 'NOT_FOUND', message);
        this.sendError(req, res, error);
    }

    protected sendConflict(req: any, res: any, message: string): void  {
        let traceId = this.getTraceId(req);
        let error = new ConflictException(traceId, 'CONFLICT', message);
        this.sendError(req, res, error);
    }

    protected sendSessionExpired(req: any, res: any, message: string): void  {
        let traceId = this.getTraceId(req);
        let error = new UnknownException(traceId, 'SESSION_EXPIRED', message);
        error.status = 440;
        this.sendError(req, res, error);
    }

    protected sendInternalError(req: any, res: any, message: string): void  {
        let traceId = this.getTraceId(req);
        let error = new UnknownException(traceId, 'INTERNAL', message);
        this.sendError(req, res, error);
    }

    protected sendServerUnavailable(req: any, res: any, message: string): void  {
        let traceId = this.getTraceId(req);
        let error = new ConflictException(traceId, 'SERVER_UNAVAILABLE', message);
        error.status = 503;
        this.sendError(req, res, error);
    }

    public invoke(operation: string): (req: any, res: any) => void {
        return (req, res) => {
            this[operation](req, res);
        }
    }

}