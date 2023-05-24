import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';
import { IdentifiableJsonMySqlPersistence } from '../../src/persistence/IdentifiableJsonMySqlPersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';
export declare class DummyJsonMySqlPersistence extends IdentifiableJsonMySqlPersistence<Dummy, string> implements IDummyPersistence {
    constructor();
    protected defineSchema(): void;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getCountByFilter(correlationId: string, filter: FilterParams): Promise<number>;
}
