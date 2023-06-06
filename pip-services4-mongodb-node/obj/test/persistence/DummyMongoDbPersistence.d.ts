import { FilterParams, PagingParams, DataPage } from 'pip-services4-data-node';
import { IdentifiableMongoDbPersistence } from '../../src/persistence/IdentifiableMongoDbPersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';
import { IContext } from 'pip-services4-components-node';
export declare class DummyMongoDbPersistence extends IdentifiableMongoDbPersistence<Dummy, string> implements IDummyPersistence {
    constructor();
    protected defineSchema(): void;
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getCountByFilter(context: IContext, filter: FilterParams): Promise<number>;
}
