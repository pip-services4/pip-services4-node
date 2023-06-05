import { DataPage, FilterParams, PagingParams } from 'pip-services4-data-node';
import { IdentifiableCouchbasePersistence } from '../../src/persistence/IdentifiableCouchbasePersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';
import { IContext } from 'pip-services4-components-node';
export declare class DummyCouchbasePersistence extends IdentifiableCouchbasePersistence<Dummy, string> implements IDummyPersistence {
    constructor();
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getCountByFilter(context: IContext, filter: FilterParams): Promise<number>;
}
