import { IContext } from 'pip-services4-components-node';
import { DataPage } from 'pip-services4-data-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { Dummy } from './Dummy';
export interface IDummyService {
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getOneById(context: IContext, id: string): Promise<Dummy>;
    create(context: IContext, entity: Dummy): Promise<Dummy>;
    update(context: IContext, entity: Dummy): Promise<Dummy>;
    deleteById(context: IContext, id: string): Promise<Dummy>;
    checkTraceId(context: IContext): Promise<string>;
}
