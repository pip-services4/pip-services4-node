import { FilterParams } from 'pip-services4-commons-node';
import { PagingParams } from 'pip-services4-commons-node';
import { DataPage } from 'pip-services4-commons-node';
import { ICommandable } from 'pip-services4-commons-node';
import { CommandSet } from 'pip-services4-commons-node';
import { IDummyController } from './IDummyController';
import { Dummy } from '../data/Dummy';
export declare class DummyController implements IDummyController, ICommandable {
    private _commandSet;
    private readonly _entities;
    getCommandSet(): CommandSet;
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getOneById(context: IContext, id: string): Promise<Dummy>;
    create(context: IContext, entity: Dummy): Promise<Dummy>;
    update(context: IContext, newEntity: Dummy): Promise<Dummy>;
    deleteById(context: IContext, id: string): Promise<Dummy>;
}
