import { IReferences } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { Descriptor } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { ObjectSchema } from 'pip-services4-data-node';
import { TypeCode } from 'pip-services4-commons-node';
import { RestController } from 'pip-services4-http-node';

import { DummySchema } from '../data/DummySchema';
import { IDummyService } from '../services/IDummyService';

export class DummyRestController extends RestController {
    private _service: IDummyService;

    public constructor() {
        super();
        this._dependencyResolver.put('service', new Descriptor("pip-services-dummies", "service", "default", "*", "*"));
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
    }

	public setReferences(references: IReferences): void {
		super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired<IDummyService>('service');
    }
    
    private async getPageByFilter(req: any, res: any) {
        try {
            const result = await this._service.getPageByFilter(
                req.params.trace_id,
                new FilterParams(req.params),
                new PagingParams(req.params),
            );
            this.sendResult(req, res, result)
        } catch (ex) {
            this.sendError(req, res, ex);
        }
    }

    private async getOneById(req, res) {
        try {
            const result = await this._service.getOneById(
                req.params.trace_id,
                req.params.dummy_id
            );
            this.sendResult(req, res, result);
        } catch (ex) {
            this.sendError(req, res, ex);            
        }
    }

    private async create(req, res) {
        try {
            const result = await this._service.create(
                req.params.trace_id,
                req.body
            );
            this.sendCreatedResult(req, res, result);
        } catch (ex) {
            this.sendError(req, res, ex);
        }
    }

    private async update(req, res) {
        try {
            const result = await this._service.update(
                req.params.trace_id,
                req.body
            );
            this.sendResult(req, res, result);
        } catch (ex) {
            this.sendError(req, res, ex);
        }
    }

    private async deleteById(req, res) {
        try {
            const result  = await this._service.deleteById(
                req.params.trace_id,
                req.params.dummy_id
            );
            this.sendDeletedResult(req, res, result);
        } catch (ex) {
            this.sendError(req, res, ex);
        }
    }    
        
    public register() {
        this.registerRoute(
            'get', '/dummies', 
            new ObjectSchema(true)
                .withOptionalProperty("skip", TypeCode.String)
                .withOptionalProperty("take", TypeCode.String)
                .withOptionalProperty("total", TypeCode.String),
            this.getPageByFilter
        );

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
            'put', '/dummies/:dummy_id', 
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
        
        this._swaggerRoute = '/dummies/swagger';
        this.registerOpenApiSpecFromFile(__dirname + '/../../../example/controllers/dummy.yml');
    }
}
