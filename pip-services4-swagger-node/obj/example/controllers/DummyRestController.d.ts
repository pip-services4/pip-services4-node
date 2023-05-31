import { IReferences } from 'pip-services4-components-node';
import { ConfigParams } from 'pip-services4-components-node';
import { RestController } from 'pip-services4-http-node';
export declare class DummyRestController extends RestController {
    private _service;
    constructor();
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    private getPageByFilter;
    private getOneById;
    private create;
    private update;
    private deleteById;
    register(): void;
}
