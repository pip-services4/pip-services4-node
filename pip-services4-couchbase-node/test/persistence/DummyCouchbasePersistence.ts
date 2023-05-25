import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

import { IdentifiableCouchbasePersistence } from '../../src/persistence/IdentifiableCouchbasePersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';

export class DummyCouchbasePersistence 
    extends IdentifiableCouchbasePersistence<Dummy, string> 
    implements IDummyPersistence
{
    public constructor() {
        super('test', 'dummies');
    }

    public getPageByFilter(context: IContext, filter: FilterParams,
        paging: PagingParams): Promise<DataPage<Dummy>> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition = null;
        if (key != null) {
            filterCondition = "key='" + key + "'";
        }

        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }

    public getCountByFilter(context: IContext, filter: FilterParams): Promise<number> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition = null;
        if (key != null) {
            filterCondition = "key='" + key + "'";
        }

        return super.getCountByFilter(context, filterCondition);
    }

}