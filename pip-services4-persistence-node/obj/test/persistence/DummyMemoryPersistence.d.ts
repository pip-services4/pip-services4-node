import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';
import { IdentifiableMemoryPersistence } from '../../src/persistence/IdentifiableMemoryPersistence';
import { Dummy } from '../Dummy';
import { IDummyPersistence } from './IDummyPersistence';
export declare class DummyMemoryPersistence extends IdentifiableMemoryPersistence<Dummy, string> implements IDummyPersistence {
    constructor();
    private composeFilter;
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getCountByFilter(context: IContext, filter: FilterParams): Promise<number>;
    getSortedPage(context: IContext, sort: any): Promise<DataPage<Dummy>>;
    getSortedList(context: IContext, sort: any): Promise<Dummy[]>;
}
