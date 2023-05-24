import { IReferences } from 'pip-services4-commons-node';
import { CloudFunctionService } from '../../src/services/CloudFunctionService';
export declare class DummyCloudFunctionService extends CloudFunctionService {
    private _controller;
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
