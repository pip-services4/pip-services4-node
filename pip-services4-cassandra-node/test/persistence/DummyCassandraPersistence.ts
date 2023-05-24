import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

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

    public getPageByFilter(correlationId: string, filter: FilterParams,
        paging: PagingParams): Promise<DataPage<Dummy>> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = '';
        if (key != null)
            filterCondition += "key='" + key + "'";

        return super.getPageByFilter(correlationId, filterCondition, paging, null, null);
    }

    public getCountByFilter(correlationId: string, filter: FilterParams): Promise<number> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = '';
        if (key != null)
            filterCondition += "key='" + key + "'";

        return super.getCountByFilter(correlationId, filterCondition);
    }
}