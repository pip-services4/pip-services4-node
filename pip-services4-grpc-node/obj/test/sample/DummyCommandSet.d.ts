import { CommandSet } from 'pip-services4-rpc-node';
import { IDummyService } from './IDummyService';
export declare class DummyCommandSet extends CommandSet {
    private _controller;
    constructor(controller: IDummyService);
    private makeGetPageByFilterCommand;
    private makeGetOneByIdCommand;
    private makeCreateCommand;
    private makeUpdateCommand;
    private makeDeleteByIdCommand;
}
