import { IContext } from 'pip-services4-components-node';
import { DataPage } from 'pip-services4-data-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { Dummy } from '../sample/Dummy';
export interface IDummyClient {
    getDummies(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getDummyById(context: IContext, dummyId: string): Promise<Dummy>;
    createDummy(context: IContext, dummy: Dummy): Promise<Dummy>;
    updateDummy(context: IContext, dummy: Dummy): Promise<Dummy>;
    deleteDummy(context: IContext, dummyId: string): Promise<Dummy>;
    checkTraceId(context: IContext): Promise<string>;
}
