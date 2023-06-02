import { LambdaClient } from '../../src/clients/LambdaClient';
import { IDummyClient } from '../IDummyClient';
import { Dummy } from '../Dummy';
import { IContext } from 'pip-services4-components-node';
import { FilterParams, PagingParams, DataPage } from 'pip-services4-data-node';
export declare class DummyLambdaClient extends LambdaClient implements IDummyClient {
    constructor();
    getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getDummyById(context: IContext, dummyId: string): Promise<Dummy>;
    createDummy(context: IContext, dummy: any): Promise<Dummy>;
    updateDummy(context: IContext, dummy: any): Promise<Dummy>;
    deleteDummy(context: IContext, dummyId: string): Promise<Dummy>;
}
