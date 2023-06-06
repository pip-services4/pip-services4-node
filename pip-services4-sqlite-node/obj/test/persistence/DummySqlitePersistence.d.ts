import { IContext } from 'pip-services4-components-node';
import { DataPage, FilterParams, PagingParams } from 'pip-services4-data-node';
import { IdentifiableSqlitePersistence } from '../../src/persistence/IdentifiableSqlitePersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';
export declare class DummySqlitePersistence extends IdentifiableSqlitePersistence<Dummy, string> implements IDummyPersistence {
    constructor();
    protected defineSchema(): void;
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getCountByFilter(context: IContext, filter: FilterParams): Promise<number>;
}
