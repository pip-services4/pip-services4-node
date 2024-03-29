

import { LambdaFunction } from '../../src/containers/LambdaFunction';
import { IDummyService } from '../IDummyService';
import { DummyFactory } from '../DummyFactory';
import { DummySchema } from '../DummySchema';
import { Dummy } from "../Dummy";
import { TypeCode } from 'pip-services4-commons-node';
import { Descriptor, IReferences } from 'pip-services4-components-node';
import { DataPage, FilterParams, PagingParams, ObjectSchema, FilterParamsSchema, PagingParamsSchema } from 'pip-services4-data-node';

export class DummyLambdaFunction extends LambdaFunction {
    private _service: IDummyService;

    public constructor() {
        super("dummy", "Dummy lambda function");
        this._dependencyResolver.put('service', new Descriptor('pip-services-dummies', 'service', 'default', '*', '*'));
        this._factories.add(new DummyFactory());
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired<IDummyService>('service');
    }

    private async getPageByFilter(params: any): Promise<DataPage<Dummy>> {
        return this._service.getPageByFilter(
            params.trace_id,
            new FilterParams(params.filter),
            new PagingParams(params.paging)
        );
    }

    private async getOneById(params: any): Promise<Dummy> {
        return this._service.getOneById(
            params.trace_id,
            params.dummy_id
        );
    }

    private async create(params: any): Promise<Dummy> {
        return this._service.create(
            params.trace_id,
            params.dummy
        );
    }

    private async update(params: any): Promise<Dummy> {
        return this._service.update(
            params.trace_id,
            params.dummy,
        );
    }

    private async deleteById(params: any): Promise<Dummy> {
        return this._service.deleteById(
            params.trace_id,
            params.dummy_id,
        );
    }

    protected register() {
        this.registerAction(
            'get_dummies',
            new ObjectSchema(true)
                .withOptionalProperty("filter", new FilterParamsSchema())
                .withOptionalProperty("paging", new PagingParamsSchema())
            , this.getPageByFilter);

        this.registerAction(
            'get_dummy_by_id',
            new ObjectSchema(true)
                .withOptionalProperty("dummy_id", TypeCode.String)
            , this.getOneById);

        this.registerAction(
            'create_dummy',
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema())
            , this.create);

        this.registerAction(
            'update_dummy',
            new ObjectSchema(true)
                .withRequiredProperty("dummy", new DummySchema())
            , this.update);

        this.registerAction(
            'delete_dummy',
            new ObjectSchema(true)
                .withOptionalProperty("dummy_id", TypeCode.String)
            , this.deleteById);
    }
}

export const handler = new DummyLambdaFunction().getHandler();