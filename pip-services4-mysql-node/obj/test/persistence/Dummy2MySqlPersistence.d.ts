import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';
import { IdentifiableMySqlPersistence } from '../../src/persistence/IdentifiableMySqlPersistence';
import { Dummy2 } from '../fixtures/Dummy2';
import { IDummy2Persistence } from '../fixtures/IDummy2Persistence';
export declare class Dummy2MySqlPersistence extends IdentifiableMySqlPersistence<Dummy2, number> implements IDummy2Persistence {
    constructor();
    protected defineSchema(): void;
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy2>>;
    getCountByFilter(context: IContext, filter: FilterParams): Promise<number>;
}
