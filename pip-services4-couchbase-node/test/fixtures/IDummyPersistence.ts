import { AnyValueMap } from 'pip-services4-commons-node';

import { IGetter } from 'pip-services4-persistence-node';
import { ISetter } from 'pip-services4-persistence-node';
import { IWriter } from 'pip-services4-persistence-node';
import { IPartialUpdater } from 'pip-services4-persistence-node';
import { Dummy } from './Dummy';
import { IContext } from 'pip-services4-components-node';
import { FilterParams, PagingParams, DataPage } from 'pip-services4-data-node';

export interface IDummyPersistence extends IGetter<Dummy, String>, ISetter<Dummy>, IWriter<Dummy, String>, IPartialUpdater<Dummy, String> {
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getCountByFilter(context: IContext, filter: FilterParams): Promise<number>;
    getListByIds(context: IContext, ids: string[]): Promise<Dummy[]>;
    getOneById(context: IContext, id: string): Promise<Dummy>;
    create(context: IContext, item: Dummy): Promise<Dummy>;
    set(context: IContext, item: Dummy): Promise<Dummy>;
    update(context: IContext, item: Dummy): Promise<Dummy>;
    updatePartially(context: IContext, id: string, data: AnyValueMap): Promise<Dummy>;
    deleteById(context: IContext, id: string): Promise<Dummy>;
    deleteByIds(context: IContext, id: string[]): Promise<void>;
}
