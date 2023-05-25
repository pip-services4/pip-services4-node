import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';
import { AnyValueMap } from 'pip-services4-commons-node';

import { IGetter } from 'pip-services4-persistence-node';
import { ISetter } from 'pip-services4-persistence-node';
import { IWriter } from 'pip-services4-persistence-node';
import { IPartialUpdater } from 'pip-services4-persistence-node';
import { Dummy } from './Dummy';

export interface IDummyPersistence extends IGetter<Dummy, String>, ISetter<Dummy>, IWriter<Dummy, String>, IPartialUpdater<Dummy, String> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getCountByFilter(correlationId: string, filter: FilterParams): Promise<number>;
    getListByIds(correlationId: string, ids: string[]): Promise<Dummy[]>;
    getOneById(correlationId: string, id: string): Promise<Dummy>;
    create(correlationId: string, item: Dummy): Promise<Dummy>;
    set(correlationId: string, item: Dummy): Promise<Dummy>;
    update(correlationId: string, item: Dummy): Promise<Dummy>;
    updatePartially(correlationId: string, id: string, data: AnyValueMap): Promise<Dummy>;
    deleteById(correlationId: string, id: string): Promise<Dummy>;
    deleteByIds(correlationId: string, id: string[]): Promise<void>;
}
