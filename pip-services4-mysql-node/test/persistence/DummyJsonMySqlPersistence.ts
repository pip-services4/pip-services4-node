import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';

import { IdentifiableJsonMySqlPersistence } from '../../src/persistence/IdentifiableJsonMySqlPersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';

export class DummyJsonMySqlPersistence 
    extends IdentifiableJsonMySqlPersistence<Dummy, string> 
    implements IDummyPersistence
{
    public constructor() {
        super('dummies_json');
    }

    protected defineSchema(): void {
        this.clearSchema();
        this.ensureTable();
        this.ensureSchema('ALTER TABLE `' + this._tableName + '` ADD `data_key` VARCHAR(50) AS (JSON_UNQUOTE(`data`->"$.key"))');
        this.ensureIndex(this._tableName + '_json_key', { "data_key": 1 }, { unique: true });
    }

    public async getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = null;
        if (key != null) {
            filterCondition += "data->key='" + key + "'";
        }

        return await super.getPageByFilter(context, filterCondition, paging, null, null);
    }

    public async getCountByFilter(context: IContext, filter: FilterParams): Promise<number> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = null;
        if (key != null) {
            filterCondition += "data->key='" + key + "'";
        }

        return await super.getCountByFilter(context, filterCondition);
    }
}