import { DataPage } from 'pip-services4-commons-node';
import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { Dummy } from './Dummy';
export interface IDummyController {
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getOneById(context: IContext, id: string): Promise<Dummy>;
    create(context: IContext, entity: Dummy): Promise<Dummy>;
    update(context: IContext, entity: Dummy): Promise<Dummy>;
    deleteById(context: IContext, id: string): Promise<Dummy>;
}
