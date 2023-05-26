import { IContext } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { DataPage } from 'pip-services4-data-node';
import { IDummyService } from '../sample/IDummyService';
import { Dummy } from '../sample/Dummy';
import { DirectClient } from '../../src/clients/DirectClient';
import { IDummyClient } from './IDummyClient';
export declare class DummyDirectClient extends DirectClient<IDummyService> implements IDummyClient {
    constructor();
    getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getDummyById(context: IContext, dummyId: string): Promise<Dummy>;
    createDummy(context: IContext, dummy: any): Promise<Dummy>;
    updateDummy(context: IContext, dummy: any): Promise<Dummy>;
    deleteDummy(context: IContext, dummyId: string): Promise<Dummy>;
    checkTraceId(context: IContext): Promise<string>;
}
