import { IReferences } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { Descriptor } from 'pip-services4-commons-node';
import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { ObjectSchema } from 'pip-services4-commons-node';
import { TypeCode } from 'pip-services4-commons-node';
import { RestService } from 'pip-services4-rpc-node';

import { DummySchema } from '../data/DummySchema';
import { IDummyController } from '../logic/IDummyController';

export class DummyRestService extends RestService {
    private _controller: IDummyController;

    public constructor() {
        super();
        this._dependencyResolver.put('controller', new Descriptor("pip-services-dummies", "controller", "default", "*", "*"));
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
    }

	public setReferences(references: IReferences): void {
		super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IDummyController>('controller');
    }
    
    private async getPageByFilter(req: any, res: any) {
        try {
            let result = await this._controller.getPageByFilter(
                req.params.correlation_id,
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
            let result = await this._controller.getOneById(
                req.params.correlation_id,
                req.params.dummy_id
            );
            this.sendResult(req, res, result);
        } catch (ex) {
            this.sendError(req, res, ex);            
        }
    }

    private async create(req, res) {
        try {
            let result = await this._controller.create(
                req.params.correlation_id,
                req.body
            );
            this.sendCreatedResult(req, res, result);
        } catch (ex) {
            this.sendError(req, res, ex);
        }
    }

    private async update(req, res) {
        try {
            let result = await this._controller.update(
                req.params.correlation_id,
                req.body
            );
            this.sendResult(req, res, result);
        } catch (ex) {
            this.sendError(req, res, ex);
        }
    }

    private async deleteById(req, res) {
        try {
            let result  = await this._controller.deleteById(
                req.params.correlation_id,
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
        this.registerOpenApiSpecFromFile(__dirname + '/../../../example/services/dummy.yml');
    }
}
