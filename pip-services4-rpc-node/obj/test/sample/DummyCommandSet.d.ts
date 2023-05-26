import { CommandSet } from '../../src/commands/CommandSet';
import { IDummyService } from './IDummyService';
export declare class DummyCommandSet extends CommandSet {
    private _service;
    constructor(service: IDummyService);
    private makeGetPageByFilterCommand;
    private makeGetOneByIdCommand;
    private makeCreateCommand;
    private makeUpdateCommand;
    private makeDeleteByIdCommand;
    private makeCheckTraceIdCommand;
}
