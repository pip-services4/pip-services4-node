import { IContext } from 'pip-services4-components-node';
import { PagingParams, FilterParams, DataPage } from 'pip-services4-data-node';
import { IdentifiableJsonSqlitePersistence } from '../../src/persistence/IdentifiableJsonSqlitePersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';

export class DummyJsonSqlitePersistence 
    extends IdentifiableJsonSqlitePersistence<Dummy, string> 
    implements IDummyPersistence
{
    public constructor() {
        super('dummies_json');
    }

    protected defineSchema(): void {
        this.clearSchema();
        this.ensureTable();
        this.ensureSchema("CREATE UNIQUE INDEX IF NOT EXISTS \"" + this._tableName + "_json_key\" ON dummies_json (JSON_EXTRACT(data, '$.key'))");
    }

    public getPageByFilter(context: IContext, filter: FilterParams,
        paging: PagingParams): Promise<DataPage<Dummy>> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = null;
        if (key != null)
            filterCondition = "JSON_EXTRACT(data, '$.key')='" + key + "'";

        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }

    public getCountByFilter(context: IContext, filter: FilterParams): Promise<number> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = null;
        if (key != null)
            filterCondition = "JSON_EXTRACT(data, '$.key')='" + key + "'";

        return super.getCountByFilter(context, filterCondition);
    }
}