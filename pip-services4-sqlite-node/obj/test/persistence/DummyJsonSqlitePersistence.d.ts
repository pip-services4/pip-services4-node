import { IContext } from 'pip-services4-components-node';
import { PagingParams, FilterParams, DataPage } from 'pip-services4-data-node';
import { IdentifiableJsonSqlitePersistence } from '../../src/persistence/IdentifiableJsonSqlitePersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';
export declare class DummyJsonSqlitePersistence extends IdentifiableJsonSqlitePersistence<Dummy, string> implements IDummyPersistence {
    constructor();
    protected defineSchema(): void;
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getCountByFilter(context: IContext, filter: FilterParams): Promise<number>;
}
