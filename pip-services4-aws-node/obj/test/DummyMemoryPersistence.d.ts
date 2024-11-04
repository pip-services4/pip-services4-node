import { IContext } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { DataPage } from 'pip-services4-data-node';
import { IDummyPersistence } from './IDummyPersistence';
import { IdentifiableMemoryPersistence } from 'pip-services4-persistence-node';
import { Dummy } from './Dummy';
export declare class DummyMemoryPersistence extends IdentifiableMemoryPersistence<Dummy, string> implements IDummyPersistence {
    constructor();
    private composeFilter;
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
}
