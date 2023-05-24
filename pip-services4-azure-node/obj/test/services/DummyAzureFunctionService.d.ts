import { IReferences } from 'pip-services4-commons-node';
import { AzureFunctionService } from '../../src/services/AzureFunctionService';
export declare class DummyAzureFunctionService extends AzureFunctionService {
    private _controller;
    private _headers;
    constructor();
    protected getBodyData(context: any): any;
    setReferences(references: IReferences): void;
    private getPageByFilter;
    private getOneById;
    private create;
    private update;
    private deleteById;
    protected register(): void;
}
