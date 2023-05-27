import { IContext } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { DataPage } from 'pip-services4-data-node';

import { IdentifiableMemoryPersistence } from '../../src/persistence/IdentifiableMemoryPersistence';
import { Dummy } from '../sample/Dummy';
import { IDummyPersistence } from './IDummyPersistence';

export class DummyMemoryPersistence
    extends IdentifiableMemoryPersistence<Dummy, string>
    implements IDummyPersistence {


    public constructor() {
        super();
    }

    private composeFilter(filter: FilterParams): (item: Dummy) => boolean {
        filter = filter != null ? filter : new FilterParams();
        let key = filter.getAsNullableString("key");

        return (item) => {
            if (key != null && item.key != key)
                return false;
            return true;
        };
    }

    public async getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        return await super.getPageByFilter(context, this.composeFilter(filter), paging, null, null);
    }

    public async getCountByFilter(context: IContext, filter: FilterParams): Promise<number> {
        return await super.getCountByFilter(context, this.composeFilter(filter));
    }

    public async getSortedPage(context: IContext, sort: any): Promise<DataPage<Dummy>> {
        return await super.getPageByFilter(context, null, null, sort, null);
    }

    public async getSortedList(context: IContext, sort: any): Promise<Dummy[]> {
        return await super.getListByFilter(context, null, sort, null);
    }
}