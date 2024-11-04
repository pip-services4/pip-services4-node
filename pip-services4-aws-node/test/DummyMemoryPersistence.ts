import { IContext } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { DataPage } from 'pip-services4-data-node';

import { IDummyPersistence } from './IDummyPersistence';
import { IdentifiableMemoryPersistence } from 'pip-services4-persistence-node';
import { Dummy } from './Dummy';

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
}