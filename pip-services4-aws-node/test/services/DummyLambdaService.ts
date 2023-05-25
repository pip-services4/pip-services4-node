import { DataPage } from 'pip-services4-commons-node';
import { Descriptor } from 'pip-services4-commons-node';
import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams} from 'pip-services4-commons-node';
import { IReferences } from 'pip-services4-commons-node';
import { ObjectSchema } from 'pip-services4-commons-node';
import { TypeCode } from 'pip-services4-commons-node';
import { FilterParamsSchema } from 'pip-services4-commons-node';
import { PagingParamsSchema } from 'pip-services4-commons-node';

import { LambdaService } from '../../src/services/LambdaService';
import { IDummyController } from '../IDummyController';
import { DummySchema } from '../DummySchema';
import { Dummy } from "../Dummy";

export class DummyLambdaService extends LambdaService {
    private _controller: IDummyController;

    public constructor() {
        super("dummies");
        this._dependencyResolver.put('controller', new Descriptor('pip-services-dummies', 'controller', 'default', '*', '*'));
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IDummyController>('controller');
    }

    private async getPageByFilter(params: any): Promise<DataPage<Dummy>> {
        return this._controller.getPageByFilter(
            params.trace_id,
            new FilterParams(params.filter),
            new PagingParams(params.paging)
        );
    }

    private async getOneById(params: any): Promise<Dummy> {
        return this._controller.getOneById(
            params.trace_id,
            params.dummy_id
        );
    }

    private async create(params: any): Promise<Dummy> {
        return this._controller.create(
            params.trace_id,
            params.dummy
        );
    }

    private async update(params: any): Promise<Dummy> {
        return this._controller.update(
            params.trace_id,
            params.dummy,
        );
    }

    private async deleteById(params: any): Promise<Dummy> {
        return this._controller.deleteById(
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
