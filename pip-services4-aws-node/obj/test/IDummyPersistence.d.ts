import { IContext } from 'pip-services4-components-node';
import { DataPage, FilterParams, PagingParams } from 'pip-services4-data-node';
import { IGetter, IPartialUpdater, IWriter } from 'pip-services4-persistence-node';
import { Dummy } from './Dummy';
export interface IDummyPersistence extends IGetter<Dummy, String>, IWriter<Dummy, String>, IPartialUpdater<Dummy, String> {
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getOneById(context: IContext, id: string): Promise<Dummy>;
    create(context: IContext, item: Dummy): Promise<Dummy>;
    update(context: IContext, item: Dummy): Promise<Dummy>;
    deleteById(context: IContext, id: string): Promise<Dummy>;
}
