import { FilterParams, PagingParams, DataPage } from 'pip-services4-data-node';
import { IdentifiableMongoDbPersistence } from '../../src/persistence/IdentifiableMongoDbPersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';
import { IContext } from 'pip-services4-components-node';

export class DummyMongoDbPersistence 
    extends IdentifiableMongoDbPersistence<Dummy, string> 
    implements IDummyPersistence
{
    public constructor() {
        super('dummies');
    }

    protected defineSchema(): void {
        this.ensureIndex({ key: 1 });
    }

    public getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: any = {};
        if (key != null)
            filterCondition['key'] = key;

        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }

    public getCountByFilter(context: IContext, filter: FilterParams): Promise<number> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: any = {};
        if (key != null)
            filterCondition['key'] = key;

        return super.getCountByFilter(context, filterCondition);
    }
}