import { IReferences } from 'pip-services4-components-node';
import { CloudFunctionController } from '../../src/controllers/CloudFunctionController';
export declare class DummyCloudController extends CloudFunctionController {
    private _service;
    private _headers;
    constructor();
    setReferences(references: IReferences): void;
    private getPageByFilter;
    private getOneById;
    private create;
    private update;
    private deleteById;
    protected register(): void;
}
