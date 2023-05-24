import { DataPage } from 'pip-services4-commons-node';
import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { Dummy } from '../Dummy';
export interface IDummyClient {
    getDummies(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getDummyById(correlationId: string, dummyId: string): Promise<Dummy>;
    createDummy(correlationId: string, dummy: Dummy): Promise<Dummy>;
    updateDummy(correlationId: string, dummy: Dummy): Promise<Dummy>;
    deleteDummy(correlationId: string, dummyId: string): Promise<Dummy>;
}
