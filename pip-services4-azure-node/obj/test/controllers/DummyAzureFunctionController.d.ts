import { AzureFunctionController } from '../../src/controllers/AzureFunctionController';
import { IReferences } from 'pip-services4-components-node';
export declare class DummyAzureFunctionController extends AzureFunctionController {
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
