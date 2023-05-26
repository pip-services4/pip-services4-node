import { IContext } from 'pip-services4-components-node';
import { FilterParams } from 'pip-services4-data-node';
import { PagingParams } from 'pip-services4-data-node';
import { DataPage } from 'pip-services4-data-node';
import { ICommandable } from '../../src/commands/ICommandable';
import { CommandSet } from '../../src/commands/CommandSet';
import { IDummyService } from './IDummyService';
import { Dummy } from './Dummy';
export declare class DummyService implements IDummyService, ICommandable {
    private _commandSet;
    private readonly _entities;
    getCommandSet(): CommandSet;
    getPageByFilter(context: IContext, filter: FilterParams, paging: PagingParams): Promise<DataPage<Dummy>>;
    getOneById(context: IContext, id: string): Promise<Dummy>;
    create(context: IContext, entity: Dummy): Promise<Dummy>;
    update(context: IContext, newEntity: Dummy): Promise<Dummy>;
    deleteById(context: IContext, id: string): Promise<Dummy>;
    checkTraceId(context: IContext): Promise<string>;
}
