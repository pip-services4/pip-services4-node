

import { IContext } from 'pip-services4-components-node';
import { FilterParams, PagingParams, DataPage } from 'pip-services4-data-node';
import { IdentifiableCassandraPersistence } from '../../src/persistence/IdentifiableCassandraPersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';

export class DummyCassandraPersistence 
    extends IdentifiableCassandraPersistence<Dummy, string> 
    implements IDummyPersistence
{
    public constructor() {
        super('dummies', 'test');
    }

    protected defineSchema(): void {
        this.clearSchema();
        this.ensureSchema('CREATE TABLE ' + this.quotedTableName() + ' (id TEXT PRIMARY KEY, key TEXT, content TEXT)');
        this.ensureIndex('key', { key: 1 }, { unique: true });
    }

    public getPageByFilter(context: IContext, filter: FilterParams,
        paging: PagingParams): Promise<DataPage<Dummy>> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = '';
        if (key != null)
            filterCondition += "key='" + key + "'";

        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }

    public getCountByFilter(context: IContext, filter: FilterParams): Promise<number> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = '';
        if (key != null)
            filterCondition += "key='" + key + "'";

        return super.getCountByFilter(context, filterCondition);
    }
}