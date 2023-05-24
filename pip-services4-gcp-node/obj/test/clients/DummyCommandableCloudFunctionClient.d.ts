import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';
import { CommandableCloudFunctionClient } from '../../src/clients/CommandableCloudFunctionClient';
import { IDummyClient } from '../IDummyClient';
import { Dummy } from '../Dummy';
export declare class DummyCommandableCloudFunctionClient extends CommandableCloudFunctionClient implements IDummyClient {
    constructor();
    getDummies(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getDummyById(correlationId: string, dummyId: string): Promise<Dummy>;
    createDummy(correlationId: string, dummy: any): Promise<Dummy>;
    updateDummy(correlationId: string, dummy: any): Promise<Dummy>;
    deleteDummy(correlationId: string, dummyId: string): Promise<Dummy>;
}
