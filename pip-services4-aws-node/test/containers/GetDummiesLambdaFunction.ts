

import { LambdaSingleFunction } from '../../src/containers/LambdaSingleFunction';
import { IDummyService } from '../IDummyService';
import { DummyFactory } from '../DummyFactory';
import { DummySchema } from '../DummySchema';
import { Dummy } from "../Dummy";
import { TypeCode } from 'pip-services4-commons-node';
import { Descriptor, IReferences } from 'pip-services4-components-node';
import { DataPage, FilterParams, PagingParams, ObjectSchema, FilterParamsSchema, PagingParamsSchema } from 'pip-services4-data-node';

export class GetDummiesLambdaFunction extends LambdaSingleFunction {
    private _service: IDummyService;

    public constructor() {
        super("get_dummies", "Get Dummies lambda single function");
        this._dependencyResolver.put('single-service', new Descriptor('pip-services-dummies', 'service', 'single-service', '*', '*'));
        this._factories.add(new DummyFactory());
    }

    public setReferences(references: IReferences): void {
        super.setReferences(references);
        this._service = this._dependencyResolver.getOneRequired<IDummyService>('single-service');
    }

    private async getPageByFilter(params: any): Promise<DataPage<Dummy>> {
        return this._service.getPageByFilter(
            params.trace_id,
            new FilterParams(params.filter),
            new PagingParams(params.paging)
        ); 
    }

    protected register() {
        this.registerSingleAction(
            new ObjectSchema(true)
                .withOptionalProperty("filter", new FilterParamsSchema())
                .withOptionalProperty("paging", new PagingParamsSchema())
            , this.getPageByFilter);
    }
}

export const getDummiesHandler = new GetDummiesLambdaFunction().getHandler();