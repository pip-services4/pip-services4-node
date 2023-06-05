

import { AzureFunctionController } from '../../src/controllers/AzureFunctionController';
import { IDummyService } from '../IDummyService';
import { DummySchema } from '../DummySchema';
import { TypeCode } from 'pip-services4-commons-node';
import { Descriptor, IReferences } from 'pip-services4-components-node';
import { FilterParams, PagingParams, ObjectSchema, FilterParamsSchema, PagingParamsSchema } from 'pip-services4-data-node';

export class DummyAzureFunctionController extends AzureFunctionController {
    private _controller: IDummyService;
    private _headers = {
        'Content-Type': 'application/json'
    };

    public constructor() {
        super("dummies");
        this._dependencyResolver.put('service', new Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
    }

    protected getBodyData(context:any): any {
        let params = {
            ...context,
        };
        if (context.hasOwnProperty('body')) {
            params = {
                ...params,
                ...context.body,
            }
        }
        return params;
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IDummyService>('service');
    }

    private async getPageByFilter(req: any): Promise<any> {
        const page = await this._controller.getPageByFilter(
            req.body.trace_id,
            new FilterParams(req.body.filter),
            new PagingParams(req.body.paging)
        );
        return { body: page, headers: this._headers };
    }

    private async getOneById(req: any): Promise<any> {
        let params = this.getBodyData(req);
        const dummy = await this._controller.getOneById(
            params.trace_id,
            params.dummy_id
        );
        return { body: dummy, headers: this._headers };
    }

    private async create(req: any): Promise<any> {
        let params = this.getBodyData(req);
        const dummy = await this._controller.create(
            params.trace_id,
            params.dummy
        );
        return { body: dummy, headers: this._headers };
    }

    private async update(req: any): Promise<any> {
        let params = this.getBodyData(req);
        const dummy = await this._controller.update(
            params.trace_id,
            params.dummy,
        );
        return { body: dummy, headers: this._headers };
    }

    private async deleteById(req: any): Promise<any> {
        let params = this.getBodyData(req);
        const dummy = await this._controller.deleteById(
            params.trace_id,
            params.dummy_id,
        );
        return { body: dummy, headers: this._headers };
    }

    protected register() {

        this.registerAction(
            'get_dummies',
            new ObjectSchema(true).withOptionalProperty('body', 
                new ObjectSchema()
                    .withOptionalProperty("filter", new FilterParamsSchema())
                    .withOptionalProperty("paging", new PagingParamsSchema())),
            this.getPageByFilter);

        this.registerAction(
            'get_dummy_by_id',
            new ObjectSchema(true).withOptionalProperty('body', 
                new ObjectSchema(true)
                    .withOptionalProperty("dummy_id", TypeCode.String)
            ),
            this.getOneById);

        this.registerAction(
            'create_dummy',
            new ObjectSchema(true).withOptionalProperty('body', 
                new ObjectSchema(true)
                    .withRequiredProperty("dummy", new DummySchema())
            ),
            this.create);

        this.registerAction(
            'update_dummy',
            new ObjectSchema(true).withOptionalProperty('body',
                new ObjectSchema(true)
                    .withRequiredProperty("dummy", new DummySchema())
            ),
            this.update);

        this.registerAction(
            'delete_dummy',
            new ObjectSchema(true).withOptionalProperty('body',
                new ObjectSchema(true)
                    .withOptionalProperty("dummy_id", TypeCode.String)
            ), this.deleteById);
    }
}
