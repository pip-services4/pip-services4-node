import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';
import { AnyValueMap } from 'pip-services4-commons-node';

import { IGetter } from 'pip-services4-persistence-node';
import { IWriter } from 'pip-services4-persistence-node';
import { IPartialUpdater } from 'pip-services4-persistence-node';
import { Dummy2 } from './Dummy2';

export interface IDummy2Persistence extends IGetter<Dummy2, number>, IWriter<Dummy2, number>, IPartialUpdater<Dummy2, number> {
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy2>>;
    getCountByFilter(context: IContext, filter: FilterParams): Promise<number>;
    getListByIds(context: IContext, ids: number[]): Promise<Dummy2[]>;
    getOneById(context: IContext, id: number): Promise<Dummy2>;
    create(context: IContext, item: Dummy2): Promise<Dummy2>;
    update(context: IContext, item: Dummy2): Promise<Dummy2>;
    set(context: IContext, item: Dummy2): Promise<Dummy2>;
    updatePartially(context: IContext, id: number, data: AnyValueMap): Promise<Dummy2>;
    deleteById(context: IContext, id: number): Promise<Dummy2>;
    deleteByIds(context: IContext, id: number[]): Promise<void>;
}
