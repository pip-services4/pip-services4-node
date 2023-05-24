import { DataPage } from 'pip-services4-commons-node';
import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { Dummy } from './Dummy';
export interface IDummyController {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getOneById(correlationId: string, id: string): Promise<Dummy>;
    create(correlationId: string, entity: Dummy): Promise<Dummy>;
    update(correlationId: string, entity: Dummy): Promise<Dummy>;
    deleteById(correlationId: string, id: string): Promise<Dummy>;
}
