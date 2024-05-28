import { Context } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { ObjectSchema } from 'pip-services4-data-node';
import { TypeCode } from 'pip-services4-commons-node';
import { FilterParamsSchema } from 'pip-services4-data-node';

import { DummySchema } from '../sample/DummySchema';
import { RestController } from '../../src/controllers/RestController';
import { IDummyService } from '../sample/IDummyService';

export class DummyRestController extends RestController {
    private _service: IDummyService;
    private _numberOfCalls: number = 0;
    private _swaggerContent: string;
    private _swaggerPath: string;

    public constructor() {
        super();
        this._dependencyResolver.put('service', new Descriptor("pip-services-dummies", "service", "default", "*", "*"));
    }

    public configure(config: ConfigParams): void {
        super.configure(config);

        this._swaggerContent = config.getAsNullableString("swagger.content");
        this._swaggerPath = config.getAsNullableString("swagger.path");
    }

	public setReferences(references: IReferences): void {
		super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired<IDummyService>('service');
    }
    
    public getNumberOfCalls(): number {
        return this._numberOfCalls;
    }

    private incrementNumberOfCalls(req: any, res: any, next: () => void) {
        this._numberOfCalls++;
        next();
    }

    private getPageByFilter(req: any, res: any) {
        let promise = this._service.getPageByFilter(
            Context.fromTraceId(this.getTraceId(req)),
            this.getFilterParams(req),
            this.getPagingParams(req)
        );
        this.sendResult(req, res, promise);
    }

    private getOneById(req, res) {
        let promise = this._service.getOneById(
            Context.fromTraceId(this.getTraceId(req)),
            req.params.dummy_id
        );
        this.sendResult(req, res, promise);
    }

    private create(req, res) {
        let promise = this._service.create(
            Context.fromTraceId(this.getTraceId(req)),
            req.body
        );
        this.sendCreatedResult(req, res, promise);
    }

    private update(req, res) {
        let promise = this._service.update(
            Context.fromTraceId(this.getTraceId(req)),
            req.body
        );
        this.sendResult(req, res, promise)
    }

    private deleteById(req, res) {
        let promise = this._service.deleteById(
            Context.fromTraceId(this.getTraceId(req)),
            req.params.dummy_id,
        );
        this.sendDeletedResult(req, res, promise);
    }    

    private async checkTraceId(req, res) {
        try {
            let result = await this._service.checkTraceId(
                Context.fromTraceId(this.getTraceId(req))
            );
            this.sendResult(req, res, { trace_id: result });
        } catch (ex) {
            this.sendError(req, res, ex);
        }
    }
        
    public register() {
        this.registerInterceptor('/dummies$', this.incrementNumberOfCalls);

        this.registerRoute(
            'get', '/dummies', 
            new ObjectSchema(true)
                .withOptionalProperty("skip", TypeCode.String)
                .withOptionalProperty("take", TypeCode.String)
                .withOptionalProperty("total", TypeCode.String)
                .withOptionalProperty("body", new FilterParamsSchema()),
            this.getPageByFilter
        );

        this.registerRoute(
            "get", "/dummies/check/trace_id",
            new ObjectSchema(true),
            this.checkTraceId,
        )

        this.registerRoute(
            'get', '/dummies/:dummy_id', 
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
            this.getOneById
        );

        this.registerRoute(
            'post', '/dummies', 
            new ObjectSchema(true)
                .withRequiredProperty("body", new DummySchema()),
            this.create
        );

        this.registerRoute(
            'put', '/dummies', 
            new ObjectSchema(true)
                .withRequiredProperty("body", new DummySchema()),
            this.update
        );

        this.registerRoute(
            'delete', '/dummies/:dummy_id', 
            new ObjectSchema(true)
                .withRequiredProperty("dummy_id", TypeCode.String),
            this.deleteById
        );

		if (this._swaggerContent) {
            this.registerOpenApiSpec(this._swaggerContent);
        }

        if (this._swaggerPath) {
            this.registerOpenApiSpecFromFile(this._swaggerPath);
        }
    }
}
