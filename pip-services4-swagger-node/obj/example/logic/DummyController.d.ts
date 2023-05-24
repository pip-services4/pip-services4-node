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
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getOneById(correlationId: string, id: string): Promise<Dummy>;
    create(correlationId: string, entity: Dummy): Promise<Dummy>;
    update(correlationId: string, newEntity: Dummy): Promise<Dummy>;
    deleteById(correlationId: string, id: string): Promise<Dummy>;
}
