import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';
import { DirectClient } from '../../src/clients/DirectClient';
import { IDummyClient } from './IDummyClient';
import { IDummyController } from '../IDummyController';
import { Dummy } from '../Dummy';
export declare class DummyDirectClient extends DirectClient<IDummyController> implements IDummyClient {
    constructor();
    getDummies(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getDummyById(correlationId: string, dummyId: string): Promise<Dummy>;
    createDummy(correlationId: string, dummy: any): Promise<Dummy>;
    updateDummy(correlationId: string, dummy: any): Promise<Dummy>;
    deleteDummy(correlationId: string, dummyId: string): Promise<Dummy>;
    checkCorrelationId(correlationId: string): Promise<string>;
}
