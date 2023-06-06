import { IContext } from 'pip-services4-components-node';
import { FilterParams, PagingParams, DataPage } from 'pip-services4-data-node';
import { IdentifiableJsonPostgresPersistence } from '../../src/persistence/IdentifiableJsonPostgresPersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';

export class DummyJsonPostgresPersistence 
    extends IdentifiableJsonPostgresPersistence<Dummy, string> 
    implements IDummyPersistence
{
    public constructor() {
        super('dummies_json');
    }

    protected defineSchema(): void {
        this.clearSchema();
        this.ensureTable();
        this.ensureIndex(this._tableName + '_json_key', { "(data->>'key')": 1 }, { unique: true });
    }

    public getPageByFilter(context: IContext, filter: FilterParams,
        paging: PagingParams): Promise<DataPage<Dummy>> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = "";
        if (key != null)
            filterCondition += "data->>'key'='" + key + "'";

        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }

    public getCountByFilter(context: IContext, filter: FilterParams): Promise<number> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = "";
        if (key != null)
            filterCondition += "data->>'key'='" + key + "'";

        return super.getCountByFilter(context, filterCondition);
    }
}
