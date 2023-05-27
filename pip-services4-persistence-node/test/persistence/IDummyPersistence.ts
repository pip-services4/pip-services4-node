import { IContext } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { DataPage } from 'pip-services4-data-node';
import { AnyValueMap } from 'pip-services4-commons-node';

import { IGetter } from '../../src/read/IGetter';
import { IWriter } from '../../src/write/IWriter';
import { IPartialUpdater } from '../../src/write/IPartialUpdater';
import { Dummy } from '../sample/Dummy';

export interface IDummyPersistence extends IGetter<Dummy, String>, IWriter<Dummy, String>, IPartialUpdater<Dummy, String> {
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getCountByFilter(context: IContext, filter: FilterParams): Promise<number>;
    getSortedPage(context: IContext, sort: any): Promise<DataPage<Dummy>>;
    getSortedList(context: IContext, sort : any): Promise<Dummy[]>;
    getListByIds(context: IContext, ids: string[]): Promise<Dummy[]>;
    getOneById(context: IContext, id: string): Promise<Dummy>;
    create(context: IContext, item: Dummy): Promise<Dummy>;
    update(context: IContext, item: Dummy): Promise<Dummy>;
    updatePartially(context: IContext, id: string, data: AnyValueMap): Promise<Dummy>;
    deleteById(context: IContext, id: string): Promise<Dummy>;
    deleteByIds(context: IContext, id: string[]): Promise<void>;
}
