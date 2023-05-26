import { IReferences } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { RestController } from '../../src/controllers/RestController';
export declare class DummyRestController extends RestController {
    private _service;
    private _numberOfCalls;
    private _swaggerContent;
    private _swaggerPath;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    getNumberOfCalls(): number;
    private incrementNumberOfCalls;
    private getPageByFilter;
    private getOneById;
    private create;
    private update;
    private deleteById;
    private checkTraceId;
    register(): void;
}
