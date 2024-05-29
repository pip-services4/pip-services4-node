/** @module controllers */
import { IConfigurable } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { IReferenceable } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams, SortParams } from 'pip-services4-data-node';
import { CompositeLogger } from 'pip-services4-observability-node';
import { CompositeCounters } from 'pip-services4-observability-node';
import { DependencyResolver } from 'pip-services4-components-node';
export declare abstract class RestOperations implements IConfigurable, IReferenceable {
    protected _logger: CompositeLogger;
    protected _counters: CompositeCounters;
    protected _dependencyResolver: DependencyResolver;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    protected getTraceId(req: any): any;
    protected getFilterParams(req: any): FilterParams;
    protected getPagingParams(req: any): PagingParams;
    protected getSortParams(req: any): SortParams;
    protected sendResult(req: any, res: any, result: any): void;
    protected sendEmptyResult(req: any, res: any): void;
    protected sendCreatedResult(req: any, res: any, result: any): void;
    protected sendDeletedResult(req: any, res: any, result: any): void;
    protected sendError(req: any, res: any, error: any): void;
    protected sendBadRequest(req: any, res: any, message: string): void;
    protected sendUnauthorized(req: any, res: any, message: string): void;
    protected sendNotFound(req: any, res: any, message: string): void;
    protected sendConflict(req: any, res: any, message: string): void;
    protected sendSessionExpired(req: any, res: any, message: string): void;
    protected sendInternalError(req: any, res: any, message: string): void;
    protected sendServerUnavailable(req: any, res: any, message: string): void;
    invoke(operation: string): (req: any, res: any) => void;
}
