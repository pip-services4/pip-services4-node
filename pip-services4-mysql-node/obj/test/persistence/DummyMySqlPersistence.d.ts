import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';
import { IdentifiableMySqlPersistence } from '../../src/persistence/IdentifiableMySqlPersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';
export declare class DummyMySqlPersistence extends IdentifiableMySqlPersistence<Dummy, string> implements IDummyPersistence {
    constructor();
    protected defineSchema(): void;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getCountByFilter(correlationId: string, filter: FilterParams): Promise<number>;
}
