import { IContext } from 'pip-services4-components-node';
import { FilterParams, PagingParams, DataPage } from 'pip-services4-data-node';
import { IdentifiableJsonSqlServerPersistence } from '../../src/persistence/IdentifiableJsonSqlServerPersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';
export declare class DummyJsonSqlServerPersistence extends IdentifiableJsonSqlServerPersistence<Dummy, string> implements IDummyPersistence {
    constructor();
    protected defineSchema(): void;
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getCountByFilter(context: IContext, filter: FilterParams): Promise<number>;
}
