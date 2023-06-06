import { IContext } from 'pip-services4-components-node';
import { DataPage, FilterParams, PagingParams } from 'pip-services4-data-node';
import { IdentifiableSqlitePersistence } from '../../src/persistence/IdentifiableSqlitePersistence';
import { Dummy } from '../fixtures/Dummy';
import { IDummyPersistence } from '../fixtures/IDummyPersistence';

export class DummySqlitePersistence 
    extends IdentifiableSqlitePersistence<Dummy, string> 
    implements IDummyPersistence {

    public constructor() {
        super('dummies');
    }

    protected defineSchema(): void {
        this.clearSchema();
        this.ensureSchema('CREATE TABLE "' + this._tableName + '" ("id" VARCHAR(32) PRIMARY KEY, "key" VARCHAR(50), "content" TEXT)');
        this.ensureIndex(this._tableName + '_key', { key: 1 }, { unique: true });
    }

    public getPageByFilter(context: IContext, filter: FilterParams,
        paging: PagingParams): Promise<DataPage<Dummy>> {

        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = null;
        if (key != null)
            filterCondition = "\"key\"='" + key + "'";

        return super.getPageByFilter(context, filterCondition, paging, null, null);
    }

    public getCountByFilter(context: IContext, filter: FilterParams): Promise<number> {
        filter = filter || new FilterParams();
        let key = filter.getAsNullableString('key');

        let filterCondition: string = null;
        if (key != null)
            filterCondition = "\"key\"='" + key + "'";

        return super.getCountByFilter(context, filterCondition);
    }
}