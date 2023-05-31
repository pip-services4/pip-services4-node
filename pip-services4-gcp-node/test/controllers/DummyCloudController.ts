import { Descriptor } from 'pip-services4-components-node';
import { IReferences } from 'pip-services4-components-node';
import { FilterParams, ObjectSchema, PagingParams } from 'pip-services4-data-node';
import { TypeCode } from 'pip-services4-commons-node';
import { FilterParamsSchema } from 'pip-services4-data-node';
import { PagingParamsSchema } from 'pip-services4-data-node';
import { HttpResponseSender } from 'pip-services4-http-node';

import { CloudFunctionController } from '../../src/controllers/CloudFunctionController';
import { IDummyService } from '../sample/IDummyService';
import { DummySchema } from '../sample/DummySchema';

export class DummyCloudController extends CloudFunctionController {
    private _service: IDummyService;
    private _headers = {
        'Content-Type': 'application/json'
    };

    public constructor() {
        super("dummies");
        this._dependencyResolver.put('service', new Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired<IDummyService>('service');
    }

    private async getPageByFilter(req: any, res: any): Promise<any> {
        let params = req.body;
        const page = await this._service.getPageByFilter(
            params.trace_id,
            new FilterParams(params.filter),
            new PagingParams(params.paging)
        );
        
        res.set(this._headers);
        HttpResponseSender.sendResult(req, res, page)
    }

    private async getOneById(req: any, res: any): Promise<any> {
        let params = req.body;
        const dummy = await this._service.getOneById(
            params.trace_id,
            params.dummy_id
        );

        res.set(this._headers);
        if (dummy != null) {
            HttpResponseSender.sendResult(req, res, dummy);
        } else {
            HttpResponseSender.sendEmptyResult(req, res);
        }
        
    }

    private async create(req: any, res: any): Promise<any> {
        let params = req.body;
        const dummy = await this._service.create(
            params.trace_id,
            params.dummy
        );

        res.set(this._headers);
        HttpResponseSender.sendCreatedResult(req, res, dummy);
    }

    private async update(req: any, res: any): Promise<any> {
        let params = req.body;
        const dummy = await this._service.update(
            params.trace_id,
            params.dummy,
        );

        res.set(this._headers);
        HttpResponseSender.sendResult(req, res, dummy)
    }

    private async deleteById(req: any, res: any): Promise<any> {
        let params = req.body;
        const dummy = await this._service.deleteById(
            params.trace_id,
            params.dummy_id,
        );

        res.set(this._headers);
        HttpResponseSender.sendDeletedResult(req, res, dummy)
    }

    protected register() {
        this.registerAction(
            'get_dummies',
            new ObjectSchema(true)
                .withOptionalProperty('body',
                    new ObjectSchema(true)
                        .withOptionalProperty("filter", new FilterParamsSchema())
                        .withOptionalProperty("paging", new PagingParamsSchema())
                )
            , this.getPageByFilter);

        this.registerAction(
            'get_dummy_by_id',
            new ObjectSchema(true)
                .withOptionalProperty("body",
                    new ObjectSchema(true)
                        .withOptionalProperty("dummy_id", TypeCode.String)
                )
            , this.getOneById);

        this.registerAction(
            'create_dummy',
            new ObjectSchema(true)
                .withOptionalProperty("body",
                    new ObjectSchema(true)
                        .withRequiredProperty("dummy", new DummySchema())
                )
            , this.create);

        this.registerAction(
            'update_dummy',
            new ObjectSchema(true)
                .withOptionalProperty("body",
                    new ObjectSchema(true)
                        .withRequiredProperty("dummy", new DummySchema())
                )
            , this.update);

        this.registerAction(
            'delete_dummy',
            new ObjectSchema(true)
                .withOptionalProperty("body",
                    new ObjectSchema(true)
                        .withOptionalProperty("dummy_id", TypeCode.String)
                )
            , this.deleteById);
    }
}
