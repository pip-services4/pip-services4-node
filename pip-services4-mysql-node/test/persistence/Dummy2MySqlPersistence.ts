import { IContext } from 'pip-services4-components-node';
import { FilterParams, PagingParams, DataPage } from 'pip-services4-data-node';
import { IdentifiableMySqlPersistence } from '../../src/persistence/IdentifiableMySqlPersistence';
import { Dummy2 } from '../fixtures/Dummy2';
import { IDummy2Persistence } from '../fixtures/IDummy2Persistence';

export class Dummy2MySqlPersistence 
    extends IdentifiableMySqlPersistence<Dummy2, number> 
    implements IDummy2Persistence
{
    public constructor() {
        super('dummies2');
        this._autoGenerateId = false;
    }

    protected defineSchema(): void {
        this.clearSchema();
        this.ensureSchema('CREATE TABLE `' + this._tableName + '` (id INTEGER PRIMARY KEY, `key` VARCHAR(50), `content` TEXT)');
        this.ensureIndex(this._tableName + '_key', { key: 1 }, { unique: true });
    }

    public async getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy2>> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = null;
        if (key != null) {
            filterCondition += "`key`='" + key + "'";
        }

        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }

    public async getCountByFilter(context: IContext, filter: FilterParams): Promise<number> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = null;
        if (key != null) {
            filterCondition += "`key`='" + key + "'";
        }

        return await super.getCountByFilter(context, filterCondition);
    }
}