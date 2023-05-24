import { IReferences } from 'pip-services4-commons-node';
import { ConfigParams } from 'pip-services4-commons-node';
import { RestService } from 'pip-services4-rpc-node';
export declare class DummyRestService extends RestService {
    private _controller;
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
