import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';
import { GrpcClient } from '../../src/clients/GrpcClient';
import { IDummyClient } from './IDummyClient';
import { Dummy } from '../Dummy';
export declare class DummyGrpcClient2 extends GrpcClient implements IDummyClient {
    constructor();
    getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getDummyById(context: IContext, dummyId: string): Promise<Dummy>;
    createDummy(context: IContext, dummy: any): Promise<Dummy>;
    updateDummy(context: IContext, dummy: any): Promise<Dummy>;
    deleteDummy(context: IContext, dummyId: string): Promise<Dummy>;
}
